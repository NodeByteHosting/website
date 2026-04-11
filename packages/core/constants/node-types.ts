export interface PublicNode {
  id: number
  name: string
  locationCode: string
  isMaintenanceMode: boolean
  /** Allocated memory in MiB */
  memory: number
  /** Allocated disk in MiB */
  disk: number
  /** Number of server instances currently provisioned on this node */
  serverCount?: number
}
