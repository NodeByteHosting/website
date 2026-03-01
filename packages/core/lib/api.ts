/**
 * Clean API Client for Go Backend
 * Calls Go backend directly at /api/v1/* endpoints
 */

const API_BASE = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

/**
 * Base fetch wrapper with proper error handling
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`

  // Get auth token and add to headers
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  let data: any
  try {
    data = await response.json()
  } catch {
    // If response is not JSON, throw error with status text
    throw new ApiError(response.statusText, response.status)
  }

  if (!response.ok) {
    throw new ApiError(
      data?.error || data?.message || `Request failed: ${response.status}`,
      response.status,
      data
    )
  }

  return data as T
}

/**
 * HTTP Methods (authenticated via /api/go proxy)
 */
export const api = {
  get: <T>(path: string, params?: Record<string, any>) => {
    const searchParams = params
      ? "?" + new URLSearchParams(params).toString()
      : ""
    return apiFetch<T>(`${path}${searchParams}`, { method: "GET" })
  },

  post: <T>(path: string, body?: any) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: any) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: any) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: "DELETE" }),
}

/**
 * All API calls go through apiFetch which automatically:
 * - Adds Bearer token from localStorage if available  
 * - Calls the Go backend at process.env.NEXT_PUBLIC_GO_API_URL
 * - Handles errors and response parsing
 */
