import { NextResponse } from 'next/server'

const DEFAULT_REPOSITORIES = ['NodeByteHosting/website'];

export interface GitHubRelease {
  id: number
  name: string
  tag_name: string
  body: string | null
  html_url: string
  published_at: string
  created_at: string
  draft: boolean
  prerelease: boolean
  author: {
    login: string
    avatar_url: string
    html_url: string
  }
  assets: {
    id: number
    name: string
    size: number
    download_count: number
    browser_download_url: string
  }[]
  repository: {
    name: string
    full_name: string
    html_url: string
    description: string | null
  }
}

export interface ReleasesResponse {
  releases: GitHubRelease[]
  repositories: string[]
  totalCount: number
  lastUpdated: string | null
}

async function getConfiguredRepositories(): Promise<string[]> {
  try {
    const { getConfig } = await import("@/packages/core/lib/config")
    const repos = await getConfig("github_repositories")
    
    if (repos) {
      try {
        let repoParsed: any = JSON.parse(repos)
        // handle double-encoded strings like '"[\"A\"]"'
        if (typeof repoParsed === "string") {
          try {
            const double = JSON.parse(repoParsed)
            if (Array.isArray(double)) repoParsed = double
          } catch {
            // leave as string
          }
        }

        if (Array.isArray(repoParsed) && repoParsed.length > 0) {
          return repoParsed
        }
      } catch (e) {
        console.error("[GitHub] Failed to parse stored repositories:", e)
      }
    }
  } catch (error) {
    console.error("[GitHub] Failed to fetch repositories from database:", error)
  }

  // Return defaults if no custom repos configured
  return DEFAULT_REPOSITORIES
}

async function getGithubToken(): Promise<string | null> {
  try {
    const { getConfig } = await import("@/packages/core/lib/config")
    
    const token = await getConfig("github_token")
    if (token) {
      return token
    }
  } catch (error) {
    console.error("[GitHub] Failed to fetch token from database:", error)
  }

  // Fallback to environment variable
  return process.env.GITHUB_TOKEN || null
}

async function fetchRepoReleases(repo: string, token?: string): Promise<GitHubRelease[]> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    // Fetch releases
    const releasesRes = await fetch(
      `https://api.github.com/repos/${repo}/releases?per_page=50`,
      { headers, next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!releasesRes.ok) {
      console.error(`Failed to fetch releases for ${repo}: ${releasesRes.status}`)
      return []
    }

    const releases = await releasesRes.json()

    // Fetch repo info
    const repoRes = await fetch(
      `https://api.github.com/repos/${repo}`,
      { headers, next: { revalidate: 3600 } } // Cache for 1 hour
    )

    let repoInfo = {
      name: repo.split('/')[1],
      full_name: repo,
      html_url: `https://github.com/${repo}`,
      description: null
    }

    if (repoRes.ok) {
      const repoData = await repoRes.json()
      repoInfo = {
        name: repoData.name,
        full_name: repoData.full_name,
        html_url: repoData.html_url,
        description: repoData.description
      }
    }

    // Add repository info to each release
    return releases.map((release: any) => ({
      ...release,
      repository: repoInfo
    }))
  } catch (error) {
    console.error(`Error fetching releases for ${repo}:`, error)
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repo = searchParams.get('repo') // Optional: filter by specific repo
  
  const token = await getGithubToken()
  const repositories = await getConfiguredRepositories()

  try {
    const reposToFetch = repo 
      ? repositories.filter(r => r.toLowerCase().includes(repo.toLowerCase()))
      : repositories

    // Fetch releases from all repositories in parallel
    const allReleasesArrays = await Promise.all(
      reposToFetch.map(r => fetchRepoReleases(r, token || undefined))
    )

    // Flatten and sort by published date (newest first)
    const allReleases = allReleasesArrays
      .flat()
      .sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at).getTime()
        const dateB = new Date(b.published_at || b.created_at).getTime()
        return dateB - dateA
      })

    // Get the latest update date
    const latestUpdate = allReleases.length > 0
      ? allReleases[0].published_at || allReleases[0].created_at
      : null

    // Get unique repositories that have releases
    const repositoriesWithReleases = [...new Set(allReleases.map(r => r.repository.full_name))]

    const response: ReleasesResponse = {
      releases: allReleases,
      repositories: repositoriesWithReleases,
      totalCount: allReleases.length,
      lastUpdated: latestUpdate
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching GitHub releases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch releases', releases: [], repositories: [], totalCount: 0, lastUpdated: null },
      { status: 500 }
    )
  }
}
