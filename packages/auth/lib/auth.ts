import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authenticateUser } from "./auth-service"
import { prisma } from "@/packages/core/lib/prisma"

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string
    email: string
    username: string
    firstName: string | null
    lastName: string | null
    roles: string[] // Array of role strings
    isPterodactylAdmin: boolean
    isVirtfusionAdmin: boolean
    isSystemAdmin: boolean
    pterodactylId: number | null
    emailVerified: Date | null
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    username: string
    firstName: string | null
    lastName: string | null
    roles: string[] // Array of role strings
    isPterodactylAdmin: boolean
    isVirtfusionAdmin: boolean
    isSystemAdmin: boolean
    pterodactylId: number | null
    emailVerified: Date | null
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null
        }

        const result = await authenticateUser(credentials.email, credentials.password)

        if (!result.success || !result.user) {
          return null
        }

        return {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          roles: result.user.roles || ["MEMBER"],
          isPterodactylAdmin: result.user.isPterodactylAdmin,
          isVirtfusionAdmin: result.user.isVirtfusionAdmin,
          isSystemAdmin: result.user.isSystemAdmin,
          pterodactylId: result.user.pterodactylId,
          emailVerified: result.user.emailVerified,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email!
        token.username = user.username
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.roles = user.roles || ["MEMBER"]
        token.isPterodactylAdmin = user.isPterodactylAdmin
        token.isVirtfusionAdmin = user.isVirtfusionAdmin
        token.isSystemAdmin = user.isSystemAdmin
        token.pterodactylId = user.pterodactylId
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        firstName: token.firstName,
        lastName: token.lastName,
        roles: token.roles || ["MEMBER"],
        isPterodactylAdmin: token.isPterodactylAdmin,
        isVirtfusionAdmin: token.isVirtfusionAdmin,
        isSystemAdmin: token.isSystemAdmin,
        pterodactylId: token.pterodactylId,
        emailVerified: token.emailVerified,
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
})

// Helper function to require system admin authentication
export async function requireAdmin() {
  const session = await auth()

  if (!session?.user) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  const roles = session.user.roles || []

  // Allow access if user is marked as system admin OR has an administrator role
  if (!session.user.isSystemAdmin && !isAdministrator(roles)) {
    return { authorized: false, error: "System admin access required", status: 403 }
  }

  return { authorized: true, user: session.user, status: 200 }
}

// Helper function to require Pterodactyl admin access
export async function requirePterodactylAdmin() {
  const session = await auth()

  if (!session?.user) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  if (!session.user.isPterodactylAdmin && !session.user.isSystemAdmin) {
    return { authorized: false, error: "Pterodactyl admin access required", status: 403 }
  }

  return { authorized: true, user: session.user, status: 200 }
}

// Helper function to require Virtfusion admin access
export async function requireVirtfusionAdmin() {
  const session = await auth()

  if (!session?.user) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  if (!session.user.isVirtfusionAdmin && !session.user.isSystemAdmin) {
    return { authorized: false, error: "Virtfusion admin access required", status: 403 }
  }

  return { authorized: true, user: session.user, status: 200 }
}

// Helper function to require any panel admin access
export async function requirePanelAdmin() {
  const session = await auth()

  if (!session?.user) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  if (!session.user.isPterodactylAdmin && !session.user.isVirtfusionAdmin && !session.user.isSystemAdmin) {
    return { authorized: false, error: "Panel admin access required", status: 403 }
  }

  return { authorized: true, user: session.user, status: 200 }
}

// Helper function to require any authentication
export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  return { authorized: true, user: session.user, status: 200 }
}

/**
 * Require admin authentication using the database for fresh checks
 * Use this when you need up-to-date role/isSystemAdmin checks (avoids stale JWT data)
 */
export async function requireAdminDb() {
  const session = await auth()

  if (!session?.user) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isSystemAdmin: true, roles: true },
  })

  if (!dbUser) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  if (!dbUser.isSystemAdmin && !isAdministrator(dbUser.roles || [])) {
    return { authorized: false, error: "System admin access required", status: 403 }
  }

  // merge latest roles into session user for callers
  const user = { ...session.user, roles: dbUser.roles, isSystemAdmin: dbUser.isSystemAdmin }

  return { authorized: true, user, status: 200 }
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(roles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some(role => roles.includes(role))
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(roles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.every(role => roles.includes(role))
}

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(roles: string[]): boolean {
  return roles.includes("SUPER_ADMIN")
}

/**
 * Check if user is an administrator (SUPER_ADMIN or ADMINISTRATOR)
 */
export function isAdministrator(roles: string[]): boolean {
  return roles.includes("SUPER_ADMIN") || roles.includes("ADMINISTRATOR")
}

/**
 * Check if user is on tech team (TECH_TEAM or SUPER_ADMIN or ADMINISTRATOR)
 */
export function isTechTeam(roles: string[]): boolean {
  return roles.includes("SUPER_ADMIN") || roles.includes("ADMINISTRATOR") || roles.includes("TECH_TEAM")
}

/**
 * Check if user is support staff (SUPPORT_TEAM or higher)
 */
export function isSupportStaff(roles: string[]): boolean {
  return roles.includes("SUPER_ADMIN") || roles.includes("ADMINISTRATOR") || roles.includes("SUPPORT_TEAM")
}
