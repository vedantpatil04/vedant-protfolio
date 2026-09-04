import { useCallback, useEffect, useState } from 'react'
import { educationService } from '@/services'
import { ApiError } from '@/services/api'
import type { Education } from '@/types'

/** Fetches the education list via educationService. Mirrors useSkills. */
export function useEducation() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((prev) => prev + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await educationService.list()
        if (!cancelled) {
          setEducation(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Failed to load education'
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

  return { education, loading, error, reload }
}
