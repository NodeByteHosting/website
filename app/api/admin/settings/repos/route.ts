import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { getConfig, setConfig, clearConfigCache } from "@/packages/core/lib/config"

const REPO_REGEX = /^[^\s\/]+\/[^\s\/]+$/

export async function GET() {
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
  }

  try {
    const raw = await getConfig("github_repositories")
    let repos: string[] = []
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) repos = parsed.map(String)
      } catch {
        // fallback: newline separated or single value
        repos = String(raw).split("\n").map(r => r.trim()).filter(Boolean)
      }
    }

    return NextResponse.json({ success: true, repos })
  } catch (error) {
    console.error("Failed to fetch repos:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch repos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
  }

  try {
    const body = await request.json()
    const repo = (body?.repo || "").trim()
    if (!repo || !REPO_REGEX.test(repo)) {
      return NextResponse.json({ success: false, error: "Invalid repo format. Use owner/repo." }, { status: 400 })
    }

    const raw = await getConfig("github_repositories")
    let repos: string[] = []
    if (raw) {
      try { repos = JSON.parse(raw) } catch { repos = String(raw).split("\n").map(r => r.trim()).filter(Boolean) }
    }

    if (!repos.includes(repo)) repos.push(repo)

    await setConfig("github_repositories", JSON.stringify(repos))
    clearConfigCache()

    return NextResponse.json({ success: true, repos })
  } catch (error) {
    console.error("Failed to add repo:", error)
    return NextResponse.json({ success: false, error: "Failed to add repo" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
  }

  try {
    const body = await request.json()
    const oldRepo = (body?.oldRepo || "").trim()
    const repo = (body?.repo || "").trim()
    if (!repo || !REPO_REGEX.test(repo)) {
      return NextResponse.json({ success: false, error: "Invalid repo format. Use owner/repo." }, { status: 400 })
    }

    const raw = await getConfig("github_repositories")
    let repos: string[] = []
    if (raw) {
      try { repos = JSON.parse(raw) } catch { repos = String(raw).split("\n").map(r => r.trim()).filter(Boolean) }
    }

    const idx = oldRepo ? repos.indexOf(oldRepo) : -1
    if (idx >= 0) {
      repos[idx] = repo
    } else {
      // fallback: replace first matching by prefix or just append
      const found = repos.findIndex(r => r.toLowerCase() === repo.toLowerCase())
      if (found >= 0) repos[found] = repo
      else repos.push(repo)
    }

    // Deduplicate
    repos = Array.from(new Set(repos)).map(String)

    await setConfig("github_repositories", JSON.stringify(repos))
    clearConfigCache()

    return NextResponse.json({ success: true, repos })
  } catch (error) {
    console.error("Failed to update repo:", error)
    return NextResponse.json({ success: false, error: "Failed to update repo" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
  }

  try {
    const body = await request.json()
    const repo = (body?.repo || "").trim()
    const index = typeof body?.index === "number" ? Number(body.index) : undefined

    const raw = await getConfig("github_repositories")
    let repos: string[] = []
    if (raw) {
      try { repos = JSON.parse(raw) } catch { repos = String(raw).split("\n").map(r => r.trim()).filter(Boolean) }
    }

    if (typeof index === "number") {
      if (index >= 0 && index < repos.length) repos.splice(index, 1)
    } else if (repo) {
      repos = repos.filter(r => r !== repo)
    } else {
      return NextResponse.json({ success: false, error: "Provide repo or index to delete" }, { status: 400 })
    }

    await setConfig("github_repositories", JSON.stringify(repos))
    clearConfigCache()

    return NextResponse.json({ success: true, repos })
  } catch (error) {
    console.error("Failed to delete repo:", error)
    return NextResponse.json({ success: false, error: "Failed to delete repo" }, { status: 500 })
  }
}
