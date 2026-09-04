import { useCallback, useEffect, useState } from 'react'
import { skillService } from '@/services'
import { ApiError } from '@/services/api'
import type { Skill } from '@/types'

/** Fetches the skill list via skillService. Mirrors useCertificates/useAchievements. */
export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((prev) => prev + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await skillService.list()
        if (!cancelled) {
          setSkills(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Failed to load skills'
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return { skills, loading, error, reload }
}
