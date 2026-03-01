/**
 * Setup Middleware
 * 
 * DISABLED: Setup is now handled by Go backend at /api/v1/setup
 * The Go backend manages setup status and initialization.
 */

import { NextRequest, NextResponse } from "next/server"

export async function setupMiddleware(request: NextRequest) {
  // Setup is now handled entirely by Go backend
  // This middleware is kept for backwards compatibility but does nothing
  return null
}
