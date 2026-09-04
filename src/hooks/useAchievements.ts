import { useCallback, useEffect, useState } from 'react'
import { achievementService } from '@/services'
import { ApiError } from '@/services/api'
import type { Achievement } from '@/types'

export interface UseAchievementsOptions {
  featured?: boolean
}

/**
 * Fetches the achievement list via achievementService, supporting
 * optional featured-only filtering. Mirrors useProjects/useCertificates.
 */
export function useAchievements(options?: UseAchievementsOptions) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const featured = options?.featured

  const reload = useCallback(() => {
    setReloadKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await achievementService.list({ featured })
        if (!cancelled) {
          setAchievements(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Failed to load achievements'
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
  }, [featured, reloadKey])

  return {
    achievements,
    loading,
    error,
    reload,
  }
}
