/**
 * Auth API Client
 * Direct communication with Go backend authentication endpoints
 */

export interface User {
  id: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  roles: string[]
  isPterodactylAdmin: boolean
  isVirtfusionAdmin: boolean
  isSystemAdmin: boolean
  pterodactylId: number | null
  emailVerified: string | null
}

// Role constants matching the backend enum
export const ROLES = {
  MEMBER: "MEMBER",
  PARTNER: "PARTNER",
  SPONSOR: "SPONSOR",
  TECH_TEAM: "TECH_TEAM",
  SUPPORT_TEAM: "SUPPORT_TEAM",
  ADMINISTRATOR: "ADMINISTRATOR",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/**
 * Returns true if the user can access the admin panel.
 * Admin panel requires: isSystemAdmin flag OR SUPER_ADMIN/ADMINISTRATOR role.
 */
export function canAccessAdmin(user: User | null): boolean {
  if (!user) return false
  return (
    user.isSystemAdmin ||
    user.roles.includes(ROLES.SUPER_ADMIN) ||
    user.roles.includes(ROLES.ADMINISTRATOR)
  )
}

/**
 * Returns true if the user has any elevated/staff role.
 * Used for showing the Admin badge/link in menus.
 */
export function isStaffUser(user: User | null): boolean {
  if (!user) return false
  return (
    user.isSystemAdmin ||
    user.isPterodactylAdmin ||
    user.isVirtfusionAdmin ||
    user.roles.includes(ROLES.SUPER_ADMIN) ||
    user.roles.includes(ROLES.ADMINISTRATOR) ||
    user.roles.includes(ROLES.TECH_TEAM) ||
    user.roles.includes(ROLES.SUPPORT_TEAM)
  )
}

export interface AuthResponse {
  success: boolean
  message?: string
  error?: string
  user?: User
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

const API_BASE = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Login failed")
  }

  return response.json()
}

/**
 * Register a new user
 */
export async function register(email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, confirmPassword }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Registration failed")
  }

  return response.json()
}

/**
 * Refresh access token using refresh token
 */
export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    throw new Error("Token refresh failed")
  }

  return response.json()
}

/**
 * Logout user and invalidate tokens
 */
export async function logout(refreshToken?: string): Promise<void> {
  await fetch(`${API_BASE}/api/v1/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ refreshToken }),
  })
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(accessToken: string): Promise<User> {
  const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  const data = await response.json()
  return data.user
}

/**
 * Forgot password request
 */
export async function forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  return response.json()
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  id: string,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, id, password, confirmPassword }),
  })

  return response.json()
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string, id: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, id }),
  })

  return response.json()
}
