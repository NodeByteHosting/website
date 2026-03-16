import "server-only"
import { cookies } from "next/headers"
import type { User } from "./auth-client"

const API_BASE = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"

/**
 * Get current authenticated user from server-side
 * Uses cookies to get JWT token
 */
export async function auth(): Promise<{ user: User | null }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return { user: null }
    }

    const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return { user: null }
    }

    const data = await response.json()
    return { user: data.user }
  } catch (error) {
    console.error("[Auth] Error fetching user:", error)
    return { user: null }
  }
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(roles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some((role) => roles.includes(role))
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(roles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.every((role) => roles.includes(role))
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

/**
 * Helper function to require system admin authentication
 */
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

/**
 * Helper function to require Pterodactyl admin access
 */
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

/**
 * Helper function to require Virtfusion admin access
 */
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

/**
 * Helper function to require any panel admin access
 */
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

/**
 * Helper function to require any authentication
 */
export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    return { authorized: false, error: "Not authenticated", status: 401 }
  }

  return { authorized: true, user: session.user, status: 200 }
}
