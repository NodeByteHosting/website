/**
 * Core Package Exports
 * 
 * Clean exports for the core package to simplify imports.
 */

// API Client
export { api, directApi, ApiError, type ApiResponse } from "./lib/api"

// Hooks
export {
  useApiQuery,
  useApiMutation,
  useInvalidateQueries,
} from "./hooks/use-api"

export {
  usePublicStats,
  usePanelCounts,
  type PublicStats,
  type PanelCounts,
} from "./hooks/use-public-api"

export {
  // Sync
  useSyncStatus,
  useSyncLogs,
  useTriggerSync,
  useCancelSync,
  useSyncSettings,
  useUpdateSyncSettings,
  // Users
  useAdminUsers,
  useUpdateUserRoles,
  // Servers
  useAdminServers,
  // Allocations
  useAdminAllocations,
  // Nodes & Locations
  useAdminNodes,
  useAdminNodeAllocations,
  useToggleNodeMaintenance,
  useAdminLocations,
  // Nests & Eggs
  useAdminNests,
  useAdminEggs,
  // Settings
  useAdminSettings,
  useUpdateAdminSettings,
  // Webhooks
  useWebhooks,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
} from "./hooks/use-admin-api"

// Query Client
export { QueryClientProvider } from "./lib/query-client"

// Utils
export { cn } from "./lib/utils"
