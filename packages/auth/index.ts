// Client-side auth (for Client Components)
export { AuthProvider, useAuth, getAccessToken } from "./lib/auth-context"

// Auth API client
export * from "./lib/auth-client"

// Server-side auth exports are in separate files to avoid bundling in client
// Import directly from @/packages/auth/lib/auth-server in Server Components
