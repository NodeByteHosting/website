"use client"

import { useApiQuery, useApiMutation, useInvalidateQueries } from "./use-api"
import type { ApiError } from "../lib/api"
import type { UseQueryOptions } from "@tanstack/react-query"

type QueryOptions<T = any> = Omit<UseQueryOptions<T, ApiError>, "queryKey" | "queryFn">

/**
 * Clean, type-safe admin API hooks using TanStack Query
 */

// ============================================================================
// SYNC
// ============================================================================

export function useSyncStatus() {
  return useApiQuery("/api/admin/sync")
}

export function useSyncLogs(limit = 5) {
  return useApiQuery(`/api/admin/sync/logs`, { limit })
}

export function useTriggerSync() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation("POST", "/api/admin/sync", {
    onSuccess: () => invalidate("/api/admin/sync"),
  })
}

export function useCancelSync() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation("POST", "/api/admin/sync/cancel", {
    onSuccess: () => invalidate("/api/admin/sync"),
  })
}

export function useSyncSettings() {
  return useApiQuery("/api/admin/sync/settings")
}

export function useUpdateSyncSettings() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation("POST", "/api/admin/sync/settings", {
    onSuccess: () => invalidate("/api/admin/sync"),
  })
}

// ============================================================================
// USERS
// ============================================================================

interface UseAdminUsersParams {
  page?: number
  perPage?: number
  sortField?: string
  sortOrder?: "asc" | "desc"
  filter?: string
  search?: string
}

export function useAdminUsers(params?: UseAdminUsersParams) {
  const queryParams: Record<string, any> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.perPage) queryParams.pageSize = params.perPage
  if (params?.sortField) queryParams.sort = params.sortField
  if (params?.sortOrder) queryParams.order = params.sortOrder
  if (params?.filter) queryParams.filter = params.filter
  if (params?.search) queryParams.search = params.search
  
  return useApiQuery("/api/admin/users", Object.keys(queryParams).length > 0 ? queryParams : undefined)
}

// ============================================================================
// SERVERS
// ============================================================================

interface UseAdminServersParams {
  page?: number
  perPage?: number
  status?: string
  serverType?: string
  search?: string
  sort?: string
  order?: "asc" | "desc"
}

export function useAdminServers(params?: UseAdminServersParams, options?: QueryOptions) {
  const queryParams: Record<string, any> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.perPage) queryParams.pageSize = params.perPage
  if (params?.status) queryParams.status = params.status
  if (params?.serverType) queryParams.serverType = params.serverType
  if (params?.search) queryParams.search = params.search
  if (params?.sort) queryParams.sort = params.sort
  if (params?.order) queryParams.order = params.order

  return useApiQuery("/api/admin/servers", Object.keys(queryParams).length > 0 ? queryParams : undefined, options)
}

// ============================================================================
// ALLOCATIONS
// ============================================================================

interface UseAdminAllocationsParams {
  page?: number
  perPage?: number
  nodeId?: string | number
  assigned?: "all" | "yes" | "no"
  search?: string
}

export function useAdminAllocations(params?: UseAdminAllocationsParams, options?: QueryOptions) {
  const queryParams: Record<string, any> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.perPage) queryParams.pageSize = params.perPage
  if (params?.nodeId) queryParams.nodeId = params.nodeId
  if (params?.assigned) queryParams.assigned = params.assigned
  if (params?.search) queryParams.search = params.search

  return useApiQuery("/api/admin/allocations", Object.keys(queryParams).length > 0 ? queryParams : undefined, options)
}

export function useUpdateUserRoles() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation<any, { userId: string; roles: string[] }>(
    "POST",
    "/api/admin/users/roles",
    {
      onSuccess: () => invalidate("/api/admin/users"),
    }
  )
}

// ============================================================================
// NODES & LOCATIONS
// ============================================================================

interface UseAdminNodesParams {
  page?: number
  perPage?: number
  search?: string
  maintenance?: boolean
}

export function useAdminNodes(params?: UseAdminNodesParams, options?: QueryOptions) {
  const queryParams: Record<string, any> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.perPage) queryParams.pageSize = params.perPage
  if (params?.search) queryParams.search = params.search
  if (params?.maintenance !== undefined) queryParams.maintenance = params.maintenance

  return useApiQuery("/api/admin/nodes", Object.keys(queryParams).length > 0 ? queryParams : undefined, options)
}

export function useAdminNodeAllocations(nodeId: string | number, params?: { page?: number; perPage?: number }, options?: QueryOptions) {
  const queryParams: Record<string, any> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.perPage) queryParams.pageSize = params.perPage

  return useApiQuery(`/api/admin/nodes/${nodeId}/allocations`, Object.keys(queryParams).length > 0 ? queryParams : undefined, options)
}

export function useToggleNodeMaintenance() {
  const invalidate = useInvalidateQueries()

  return useApiMutation<any, { nodeId: number }>("PATCH", ({ nodeId }) => `/api/admin/nodes/${nodeId}/maintenance`, {
    onSuccess: () => invalidate("/api/admin/nodes"),
  })
}

export function useAdminLocations(options?: QueryOptions) {
  return useApiQuery("/api/admin/locations", undefined, options)
}

// ============================================================================
// NESTS & EGGS
// ============================================================================

interface UseAdminNestsParams {
  page?: number
  perPage?: number
  search?: string
}

export function useAdminNests(params?: UseAdminNestsParams, options?: QueryOptions) {
  const queryParams: Record<string, any> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.perPage) queryParams.pageSize = params.perPage
  if (params?.search) queryParams.search = params.search

  return useApiQuery("/api/admin/nests", Object.keys(queryParams).length > 0 ? queryParams : undefined, options)
}

interface UseAdminEggsParams {
  page?: number
  perPage?: number
  search?: string
  nestId?: number
}

export function useAdminEggs(params?: UseAdminEggsParams, options?: QueryOptions) {
  const queryParams: Record<string, any> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.perPage) queryParams.pageSize = params.perPage
  if (params?.search) queryParams.search = params.search
  if (params?.nestId) queryParams.nestId = params.nestId

  return useApiQuery("/api/admin/eggs", Object.keys(queryParams).length > 0 ? queryParams : undefined, options)
}

// ============================================================================
// SETTINGS
// ============================================================================

export function useAdminSettings() {
  return useApiQuery("/api/admin/settings")
}

export function useUpdateAdminSettings() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation("POST", "/api/admin/settings", {
    onSuccess: () => invalidate("/api/admin/settings"),
  })
}

// ============================================================================
// WEBHOOKS
// ============================================================================

export function useWebhooks() {
  return useApiQuery("/api/admin/settings/webhooks")
}

export function useCreateWebhook() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation("POST", "/api/admin/settings/webhooks", {
    onSuccess: () => invalidate("/api/admin/settings/webhooks"),
  })
}

export function useUpdateWebhook() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation<any, { id: string; webhook: any }>(
    "PUT",
    "/api/admin/settings/webhooks",
    {
      onSuccess: () => invalidate("/api/admin/settings/webhooks"),
    }
  )
}

export function useDeleteWebhook() {
  const invalidate = useInvalidateQueries()
  
  return useApiMutation<any, string>(
    "DELETE",
    (webhookId) => `/api/admin/settings/webhooks/${webhookId}`,
    {
      onSuccess: () => invalidate("/api/admin/settings/webhooks"),
    }
  )
}
