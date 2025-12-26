import { prisma } from "@/packages/core/lib/prisma"
import { syncUserFromPanel } from "@/packages/core/lib/sync"
import { getPterodactylSettings, getConfig } from "@/packages/core/lib/config"
import { sendWelcomeEmail, sendVerificationEmail } from "@/packages/core/dispatchers/email"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import type { User } from "@prisma/client"

const SALT_ROUNDS = 12

interface PterodactylUser {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  admin: boolean
}

interface PterodactylUserResponse {
  object: "user"
  attributes: PterodactylUser
}

interface PterodactylListResponse {
  object: "list"
  data: PterodactylUserResponse[]
}

/**
 * Check if a user exists in the Pterodactyl panel by email
 * Uses the Application API with admin key
 */
export async function verifyPterodactylUser(email: string): Promise<PterodactylUser | null> {
  const settings = await getPterodactylSettings()

  if (!settings.url || !settings.apiKey) {
    console.error("[Auth] Pterodactyl panel not configured")
    return null
  }

  try {
    // Search for user by email using the Application API
    const response = await fetch(
      `${settings.url}/api/application/users?filter[email]=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${settings.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "NodeByte-Website/1.0 (https://nodebyte.host)",
        },
      }
    )

    if (!response.ok) {
      console.error(`[Auth] Pterodactyl API error: ${response.status}`)
      return null
    }

    const data: PterodactylListResponse = await response.json()

    // Find exact email match (filter is case-insensitive search)
    const user = data.data.find(
      (u) => u.attributes.email.toLowerCase() === email.toLowerCase()
    )

    if (user) {
      return user.attributes
    }

    return null
  } catch (error) {
    console.error("[Auth] Error verifying Pterodactyl user:", error)
    return null
  }
}

/**
 * Send email verification to user
 */
async function sendEmailVerificationToken(userId: string, email: string): Promise<void> {
  try {
    // Generate verification token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store verification token in database
    await prisma.verificationToken.create({
      data: {
        identifier: userId,
        token,
        expires,
        type: "email",
      },
    })

    // Get site URL for verification link
    const siteUrl = await getConfig("site_url") || "http://localhost:3000"
    const verificationUrl = `${siteUrl}/api/auth/verify-email?token=${token}&id=${userId}`

    // Send verification email
    await sendVerificationEmail({
      email,
      verificationToken: token,
      verificationUrl,
    })

    console.log(`[Auth] Verification email sent to ${email}`)
  } catch (error) {
    console.error(`[Auth] Failed to send verification email to ${email}:`, error)
    // Don't throw - verification email failure shouldn't block registration
  }
}

/**
 * Register a new user
 * Allows anyone to register - panel users will be synced via automated sync jobs
 * Handles migrated users (synced from panel but haven't set password yet)
 */
export async function registerUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      // User exists - check if they've already migrated (set password)
      if (existingUser.isMigrated) {
        return { success: false, error: "email_exists" }
      }
      
      // User exists but hasn't set password yet (synced from panel)
      // Let them "register" by setting their password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
      
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          isMigrated: true, // Mark as migrated - they've completed registration
          emailVerified: new Date(),
        },
      })

      // Send welcome email
      await sendWelcomeEmail(email)
      
      return { success: true, user: updatedUser }
    }

    // Check if this is the first user
    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 0

    // Brand new user - create account without requiring panel account
    // They will be synced with panel on next automated sync if they exist there
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        isMigrated: true, // They've completed registration
        emailVerified: null, // Not yet verified - user needs to verify via email
        isActive: true, // Enable account by default
        // First user gets SUPER_ADMIN access
        ...(isFirstUser && {
          isSystemAdmin: true,
          roles: ["MEMBER", "SUPER_ADMIN"],
        }),
      },
    })

    if (isFirstUser) {
      console.log(`[Auth] First user registered as SUPER_ADMIN: ${email}`)
      // Mark first user as verified (they're setting up the system)
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    } else {
      // Send verification email to new users
      await sendEmailVerificationToken(user.id, email)
      
      // Attempt to sync user data from panel in the background (non-blocking)
      // This allows users without panel accounts to still register
      syncUserFromPanel(user.id).catch((err) => {
        console.log(`[Auth] No panel sync available for new user ${email}: ${err instanceof Error ? err.message : String(err)}`)
      })
    }

    return { success: true, user }
  } catch (error) {
    console.error("[Auth] Registration error:", error)
    return { success: false, error: "server_error" }
  }
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return { success: false, error: "invalid_credentials" }
    }

    // Check if account is active
    if (!user.isActive) {
      return { success: false, error: "account_disabled" }
    }

    // Check if user has set a password (migrated)
    if (!user.password) {
      return { success: false, error: "not_migrated" }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return { success: false, error: "invalid_credentials" }
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Sync user data from panel in the background (don't block login)
    syncUserFromPanel(user.id).catch((err) => {
      console.error("[Auth] Failed to sync user on login:", err)
    })

    // Return the current user (sync happens in background)
    // Note: Email verification requirement is checked via emailVerified field in JWT
    return { success: true, user }
  } catch (error) {
    console.error("[Auth] Authentication error:", error)
    return { success: false, error: "server_error" }
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  })
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })
}

/**
 * Update user's password
 */
export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, error: "user_not_found" }
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)

    if (!isValid) {
      return { success: false, error: "invalid_password" }
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { success: true }
  } catch (error) {
    console.error("[Auth] Password update error:", error)
    return { success: false, error: "server_error" }
  }
}
