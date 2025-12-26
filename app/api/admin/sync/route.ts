import { NextResponse } from "next/server"
import { auth, requireAdmin } from "@/packages/auth"
import {
  syncLocations,
  syncNodes,
  syncAllocations,
  syncNestsAndEggs,
  syncServers,
  syncServerDatabases,
  runFullSync,
  getSyncStatus,
} from "@/packages/core/lib/sync"
import { prisma } from "@/packages/core/lib/prisma"
import { getPterodactylSettings } from "@/packages/core/lib/config"

// Types for sync targets
type SyncTarget = "locations" | "nodes" | "allocations" | "nests" | "servers" | "databases" | "users" | "all"

/**
 * Sync ALL users from panel - creates new users if they don't exist
 * New users will have isMigrated=false and no password (must register)
 */
async function syncAllPanelUsers(): Promise<{ success: boolean; created: number; updated: number; error?: string }> {
  try {
    const settings = await getPterodactylSettings()

    if (!settings.url || !settings.apiKey) {
      return { success: false, created: 0, updated: 0, error: "Missing panel configuration" }
    }

    let created = 0
    let updated = 0
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await fetch(
        `${settings.url}/api/application/users?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${settings.apiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        return { success: false, created, updated, error: `Panel API error: ${response.status}` }
      }

      const data = await response.json()
      const users = data.data || []
      const meta = data.meta?.pagination

      for (const panelUser of users) {
        const attrs = panelUser.attributes

        try {
          // Check if user already exists (by pterodactylId or email)
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { pterodactylId: attrs.id },
                { email: attrs.email },
              ],
            },
          })

          if (existingUser) {
            // Update existing user (but NEVER touch password or isMigrated status)
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                pterodactylId: attrs.id,
                username: attrs.username,
                firstName: attrs.first_name || null,
                lastName: attrs.last_name || null,
                isPterodactylAdmin: attrs.root_admin,
                lastSyncedAt: new Date(),
              },
            })
            updated++
          } else {
            // Create new user from panel (no password, not migrated)
            await prisma.user.create({
              data: {
                email: attrs.email,
                password: null, // No password - must register to set one
                username: attrs.username,
                firstName: attrs.first_name || null,
                lastName: attrs.last_name || null,
                isPterodactylAdmin: attrs.root_admin,
                pterodactylId: attrs.id,
                isMigrated: false, // Must register to complete migration
                lastSyncedAt: new Date(),
              },
            })
            created++
          }
        } catch (error) {
          console.error(`[Sync] Failed to sync panel user ${attrs.id}:`, error)
        }
      }

      // Check for more pages
      hasMore = meta && page < meta.total_pages
      page++
    }

    return { success: true, created, updated }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    return { success: false, created: 0, updated: 0, error: errorMsg }
  }
}

/**
 * POST /api/admin/sync
 * Manually trigger a sync operation
 */
export async function POST(request: Request) {
  try {
    // Require admin auth (centralized check)
    const authResult = await requireAdmin()
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }
    const session = { user: authResult.user }

    const body = await request.json()
    const target: SyncTarget = body.target || "all"

    console.log(`[Admin Sync] Starting sync for: ${target} (by ${session.user.email})`)

    let result: Record<string, unknown>

    switch (target) {
      case "locations":
        result = { locations: await syncLocations() }
        break

      case "nodes":
        result = { nodes: await syncNodes() }
        break

      case "allocations":
        result = { allocations: await syncAllocations() }
        break

      case "nests":
        result = { nests: await syncNestsAndEggs() }
        break

      case "servers":
        result = { servers: await syncServers() }
        break

      case "databases":
        result = { databases: await syncServerDatabases() }
        break

      case "users":
        // Sync ALL users from panel (creates new + updates existing)
        result = { users: await syncAllPanelUsers() }
        break

      case "all":
        // Run full sync (infrastructure + servers + databases) then users
        const fullSyncResult = await runFullSync()
        const usersResult = await syncAllPanelUsers()
        result = {
          ...fullSyncResult.results,
          users: usersResult,
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: `Invalid sync target: ${target}` },
          { status: 400 }
        )
    }

    console.log(`[Admin Sync] Completed sync for: ${target}`)

    return NextResponse.json({
      success: true,
      target,
      result,
    })
  } catch (error) {
    console.error("[Admin Sync] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/sync
 * Get sync status and recent logs
 */
export async function GET() {
  try {
    // Require admin auth (centralized check)
    const authResult = await requireAdmin()
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }
    const session = { user: authResult.user }

    const status = await getSyncStatus()

    // Get comprehensive stats
    const stats = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { isMigrated: true } }),
      prisma.server.count(),
      prisma.node.count(),
      prisma.location.count(),
      prisma.allocation.count(),
      prisma.nest.count(),
      prisma.egg.count(),
      prisma.eggVariable.count(),
      prisma.serverDatabase.count(),
    ])

    return NextResponse.json({
      success: true,
      status,
      counts: {
        users: stats[0],
        migratedUsers: stats[1],
        servers: stats[2],
        nodes: stats[3],
        locations: stats[4],
        allocations: stats[5],
        nests: stats[6],
        eggs: stats[7],
        eggVariables: stats[8],
        serverDatabases: stats[9],
      },
      availableTargets: ["locations", "nodes", "allocations", "nests", "servers", "databases", "users", "all"],
    })
  } catch (error) {
    console.error("[Admin Sync] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
