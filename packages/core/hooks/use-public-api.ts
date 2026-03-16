"use client"

import { useApiQuery } from "./use-api"

/**
 * Public API hooks - no authentication required
 */

export interface PublicStats {
  totalServers: number
  totalUsers: number
  activeUsers: number
  totalAllocations: number
}

export function usePublicStats() {
  return useApiQuery<PublicStats>("/api/stats", {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

export interface PanelCounts {
  nodes: number
  servers: number
  users: number
  allocations: number
  nests: number
}

export function usePanelCounts() {
  return useApiQuery<PanelCounts>("/api/panel/counts", {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
