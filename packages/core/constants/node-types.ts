export interface PublicNode {
  id: number
  name: string
  locationCode: string
  isMaintenanceMode: boolean
  /** Allocated memory in MiB — not known for nodes without a display override. */
  memory?: number
  /** Allocated disk in MiB — not known for nodes without a display override. */
  disk?: number
  /** Number of server instances currently provisioned on this node */
  serverCount?: number
}
