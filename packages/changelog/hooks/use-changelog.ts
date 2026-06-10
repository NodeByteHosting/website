"use client"

import { useState, useEffect } from 'react'
import type { ReleasesResponse } from '@/app/api/github/releases/route'
import { detectReleaseType, type ChangelogRelease } from '../lib/changelog'

interface UseChangelogReleasesOptions {
  initialReleases?: ChangelogRelease[]
}

export function useChangelogReleases(options: UseChangelogReleasesOptions = {}) {
  const [releases, setReleases] = useState<ChangelogRelease[]>(options.initialReleases || [])
  const [repositories, setRepositories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(!options.initialReleases)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  async function doFetch() {
    const response = await fetch('/api/github/releases')
    if (!response.ok) throw new Error('Failed to fetch releases')
    const data: ReleasesResponse = await response.json()
    const releasesWithType: ChangelogRelease[] = data.releases.map(release => ({
      ...release,
      type: detectReleaseType(release)
    }))
    setReleases(releasesWithType)
    setRepositories(data.repositories)
    setLastUpdated(data.lastUpdated)
  }

  const refetch = () => {
    setIsLoading(true)
    setError(null)
    return doFetch().then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (options.initialReleases) return
    let cancelled = false

    async function run() {
      try {
        await doFetch()
      } catch {
        if (!cancelled) setError('Failed to fetch releases')
      }
      if (!cancelled) setIsLoading(false)
    }

    run()

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    releases,
    repositories,
    isLoading,
    error,
    lastUpdated,
    refetch
  }
}
