/**
 * Setup Middleware
 * 
 * Redirects users to setup page if system hasn't been configured yet.
 * Runs on every request to check setup status.
 */

import { NextRequest, NextResponse } from "next/server"
import { isSetupComplete } from "@/packages/core/lib/setup"

// Routes that should bypass setup check
const BYPASS_ROUTES = [
  "/api/setup", // Setup API endpoint
  "/setup", // Setup page itself
  "/api/health", // Health checks
  "/_next", // Next.js internals
]

export async function setupMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip setup check for bypass routes
  if (BYPASS_ROUTES.some((route) => pathname.startsWith(route))) {
    return null // Continue with next middleware
  }

  try {
    const setupComplete = await isSetupComplete()

    // If setup is not complete, redirect to setup page (except API routes)
    if (!setupComplete) {
      if (pathname.startsWith("/api/")) {
        // For API routes, return 503 Service Unavailable
        return NextResponse.json(
          { error: "System is not configured. Please complete setup at /setup" },
          { status: 503 }
        )
      }

      // For regular routes, redirect to setup
      return NextResponse.redirect(new URL("/setup", request.url))
    }
  } catch (error) {
    console.error("[Setup Middleware] Error checking setup status:", error)
    // On error, continue without blocking
  }

  return null // Continue with next middleware
}
