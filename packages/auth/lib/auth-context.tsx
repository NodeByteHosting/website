"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import * as authClient from "./auth-client"
import type { User } from "./auth-client"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

const TOKEN_KEY = "auth_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const TOKEN_EXPIRY_KEY = "token_expiry"

// Store tokens in localStorage (or could use httpOnly cookies via server route)
const storage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  },
  setAccessToken: (token: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem(TOKEN_KEY, token)
  },
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  setRefreshToken: (token: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },
  getTokenExpiry: (): number | null => {
    if (typeof window === "undefined") return null
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    return expiry ? parseInt(expiry, 10) : null
  },
  setTokenExpiry: (expiresIn: number) => {
    if (typeof window === "undefined") return
    const expiry = Date.now() + expiresIn * 1000
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString())
  },
  clearAll: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
  },
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch current user from token
  const fetchUser = useCallback(async (token: string) => {
    try {
      const userData = await authClient.getCurrentUser(token)
      setUser(userData)
      return userData
    } catch (error) {
      console.error("Failed to fetch user:", error)
      storage.clearAll()
      setUser(null)
      return null
    }
  }, [])

  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = storage.getRefreshToken()
    if (!refreshToken) {
      storage.clearAll()
      setUser(null)
      return false
    }

    try {
      const response = await authClient.refresh(refreshToken)
      if (response.success && response.accessToken && response.refreshToken) {
        storage.setAccessToken(response.accessToken)
        storage.setRefreshToken(response.refreshToken)
        storage.setTokenExpiry(response.expiresIn || 30 * 24 * 60 * 60) // 30 days default
        await fetchUser(response.accessToken)
        return true
      }
      return false
    } catch (error) {
      console.error("Token refresh failed:", error)
      storage.clearAll()
      setUser(null)
      return false
    }
  }, [fetchUser])

  // Check if token needs refresh (refresh 5 minutes before expiry)
  const shouldRefreshToken = useCallback(() => {
    const expiry = storage.getTokenExpiry()
    if (!expiry) return true
    return Date.now() >= expiry - 5 * 60 * 1000
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getAccessToken()
      
      if (!token) {
        setIsLoading(false)
        return
      }

      // Check if token needs refresh
      if (shouldRefreshToken()) {
        const refreshed = await refreshAccessToken()
        if (!refreshed) {
          setIsLoading(false)
          return
        }
      } else {
        // Use existing token
        await fetchUser(token)
      }

      setIsLoading(false)
    }

    initAuth()
  }, [fetchUser, refreshAccessToken, shouldRefreshToken])

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!user) return

    const checkAndRefresh = async () => {
      if (shouldRefreshToken()) {
        await refreshAccessToken()
      }
    }

    // Check every minute
    const interval = setInterval(checkAndRefresh, 60 * 1000)
    return () => clearInterval(interval)
  }, [user, shouldRefreshToken, refreshAccessToken])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await authClient.login(email, password)
        
        if (!response.success || !response.accessToken || !response.refreshToken) {
          throw new Error(response.error || "Login failed")
        }

        // Store tokens
        storage.setAccessToken(response.accessToken)
        storage.setRefreshToken(response.refreshToken)
        storage.setTokenExpiry(response.expiresIn || 30 * 24 * 60 * 60)

        // Set user
        setUser(response.user || null)
      } catch (error) {
        storage.clearAll()
        setUser(null)
        throw error
      }
    },
    []
  )

  const logout = useCallback(async () => {
    const refreshToken = storage.getRefreshToken()
    
    try {
      await authClient.logout(refreshToken || undefined)
    } catch (error) {
      console.error("Logout error:", error)
    }

    storage.clearAll()
    setUser(null)
    router.push("/auth/login")
  }, [router])

  const refreshAuth = useCallback(async () => {
    await refreshAccessToken()
  }, [refreshAccessToken])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to get access token for API calls
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}
