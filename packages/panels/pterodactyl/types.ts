export interface PterodactylPaginatedResponse<T> {
  object: string
  data: T[]
  meta: {
    pagination: {
      total: number
      count: number
      per_page: number
      current_page: number
      total_pages: number
      links: Record<string, string>
    }
  }
}

export interface PterodactylServer {
  object: "server"
  attributes: {
    id: number
    external_id: string | null
    uuid: string
    identifier: string
    name: string
    description: string
    status: string | null
    suspended: boolean
    limits: {
      memory: number
      swap: number
      disk: number
      io: number
      cpu: number
      threads: string | null
      oom_disabled: boolean
    }
    feature_limits: {
      databases: number
      allocations: number
      backups: number
    }
    user: number
    node: number
    allocation: number
    nest: number
    egg: number
    container: {
      startup_command: string
      image: string
      installed: number
      environment: Record<string, string>
    }
    created_at: string
    updated_at: string
  }
}

export interface PterodactylUser {
  object: "user"
  attributes: {
    id: number
    external_id: string | null
    uuid: string
    username: string
    email: string
    first_name: string
    last_name: string
    language: string
    root_admin: boolean
    "2fa": boolean
    created_at: string
    updated_at: string
  }
}

export interface PterodactylNode {
  object: "node"
  attributes: {
    id: number
    uuid: string
    public: boolean
    name: string
    description: string | null
    location_id: number
    fqdn: string
    scheme: string
    behind_proxy: boolean
    maintenance_mode: boolean
    memory: number
    memory_overallocate: number
    disk: number
    disk_overallocate: number
    upload_size: number
    daemon_listen: number
    daemon_sftp: number
    daemon_base: string
    created_at: string
    updated_at: string
    allocated_resources?: {
      memory: number
      disk: number
    }
  }
}

export interface PterodactylDatabase {
  object: "database"
  attributes: {
    id: number
    server: number
    database: string
    remote: string
    created_at: string
    updated_at: string
  }
}

export interface PterodactylLocation {
  object: "location"
  attributes: {
    id: number
    short: string
    long: string
    created_at: string
    updated_at: string
  }
}

export interface PterodactylNest {
  object: "nest"
  attributes: {
    id: number
    name: string
    author: string
    description?: string
    created_at: string
    updated_at: string
  }
}

export interface PterodactylEgg {
  object: "egg"
  attributes: {
    id: number
    nest: number
    name: string
    description?: string
    docker_image?: string
    created_at: string
    updated_at: string
  }
}