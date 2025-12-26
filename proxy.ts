import { auth } from "@/packages/auth"
import { getSystemState } from "@/packages/core/lib/config"
import { isSetupComplete } from "@/packages/core/lib/setup"
import { NextResponse } from "next/server"

export default auth(async (req) => {
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

  // Maintenance Mode - redirect all non-admin users (except login, auth pages, and auth API)
  if (systemState.maintenanceMode && pathname !== "/maintenance" && !pathname.startsWith("/auth") && !pathname.startsWith("/api/auth")) {
    const isAdmin = (req.auth?.user?.isPterodactylAdmin || req.auth?.user?.isVirtfusionAdmin || req.auth?.user?.isSystemAdmin) ?? false
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

  // Protect admin panel and API routes - requireAdmin() in each route handles DB checks
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // API admin routes: let API endpoints perform DB-backed authorization
    if (pathname.startsWith("/api/admin")) {
      if (!req.auth?.user?.id) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        )
      }
      return response
    }

    // Frontend admin panel: require active session AND admin role
    if (!req.auth?.user?.id) {
      const loginUrl = new URL("/auth/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    const roles = (req.auth?.user?.roles as string[]) || []
    const isAdmin = (req.auth?.user?.isPterodactylAdmin || req.auth?.user?.isVirtfusionAdmin || req.auth?.user?.isSystemAdmin) ?? false
    const hasAdminRole = roles.includes("SUPER_ADMIN") || roles.includes("ADMINISTRATOR")

    if (!isAdmin && !hasAdminRole) {
      // Redirect non-admin users away from admin UI to homepage
      return NextResponse.redirect(new URL("/", req.url))
    }

    return response
  }

  return response
})

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
