import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"

// Helper to get user from JWT token
async function getUserFromToken(token: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    return null
  }
}

// Helper to get token from request
function getTokenFromRequest(req: NextRequest): string | null {
  // Try to get from Authorization header
  const authHeader = req.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Try to get from cookie (if we set it there)
  const cookie = req.cookies.get("auth_token")
  return cookie?.value || null
}

// Check if setup is complete by calling Go backend
async function isSetupComplete(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    
    // If backend is healthy, assume setup is complete
    // The backend should be running if setup is done
    return response.ok
  } catch (error) {
    // If we can't reach the backend, allow access to setup
    return false
  }
}

// Get system state from Go backend
async function getSystemState() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    
    // Default to safe values if we can't reach backend
    return {
      maintenanceMode: false,
      registrationEnabled: true,
    }
  } catch (error) {
    return {
      maintenanceMode: false,
      registrationEnabled: true,
    }
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Setup Check - redirect to setup if not complete (bypass for setup routes and static assets)
  const setupBypassRoutes = ["/setup", "/_next"]
  const shouldBypassSetupCheck = setupBypassRoutes.some((route) => pathname.startsWith(route))

  if (!shouldBypassSetupCheck) {
    const setupComplete = await isSetupComplete()
    if (!setupComplete) {
      if (pathname.startsWith("/api/")) {
        // For API routes, return 503
        return NextResponse.json(
          { error: "System is not configured. Please complete setup at /setup" },
          { status: 503 }
        )
      }
      // For regular routes, redirect to setup
      return NextResponse.redirect(new URL("/setup", req.url))
    }
  }

  // Create response with pathname header for layout to use
  const response = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  })
  response.headers.set("x-pathname", pathname)

  // Get system state for maintenance mode and registration settings
  const systemState = await getSystemState()

  // Get user from token if present (only for server-side auth checks)
  // Note: Client-side tokens in localStorage are not accessible here
  // Dashboard/Admin protection is enforced client-side via useAuth() hooks
  const token = getTokenFromRequest(req)
  let user = null
  if (token) {
    try {
      user = await getUserFromToken(token)
    } catch (error) {
      // Token validation failed, let client-side handle auth
      user = null
    }
  }

  // Maintenance Mode - redirect all non-admin users (except login, auth pages, and auth API)
  if (
    systemState.maintenanceMode &&
    pathname !== "/maintenance" &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/api/auth")
  ) {
    const isAdmin =
      user?.isPterodactylAdmin || user?.isVirtfusionAdmin || user?.isSystemAdmin || false
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/maintenance", req.url))
    }
  }

  // Registration Disabled - prevent access to signup
  if (!systemState.registrationEnabled) {
    if (pathname === "/auth/register" || pathname.startsWith("/auth/register")) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  // Dashboard & Admin routes: Let client-side useAuth() handle protection
  // Middleware allows access, client-side React will redirect if not authenticated
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return response
  }

  // API routes still require server-side auth
  // Exception: SSE stream endpoint uses ?token= query param auth (EventSource can't send headers)
  if (pathname.startsWith("/api/dashboard") || pathname.startsWith("/api/admin")) {
    if (pathname.startsWith("/api/admin/sync/stream")) {
      return response
    }
    // Allow through if the Authorization header is present (client-side Bearer token)
    // The Go backend will enforce auth; we only block if neither cookie nor header is present
    const hasAuthHeader = req.headers.get("Authorization")?.startsWith("Bearer ")
    if (!hasAuthHeader && !user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Static assets (svg, png, jpg, etc.)
     * - Public API routes that don't need auth session fetching
     */
    "/((?!_next/static|_next/image|favicon.ico|api/setup|api/auth|api/github|api/instatus|api/stats|api/trustpilot|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
