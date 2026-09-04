import { useCallback, useEffect, useState } from 'react'
import { githubService } from '@/services'
import { ApiError } from '@/services/api'
import type { GitHubSummary } from '@/types'

/**
 * Fetches the server-cached GitHub summary (profile, repos, languages,
 * recent activity, and — only when the backend has a token — contribution
 * calendar / pinned repos). A single GET; the heavy lifting (upstream
 * fetch + caching) lives server-side in github.service.ts.
 */
export function useGitHubActivity() {
  const [summary, setSummary] = useState<GitHubSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await githubService.getSummary()
        if (!cancelled) {
          setSummary(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Failed to load GitHub activity'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return {
    summary,
    loading,
    error,
    reload,
  }
}
