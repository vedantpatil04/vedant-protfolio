import { useCallback, useEffect, useState } from 'react'
import { journeyService } from '@/services'
import { ApiError } from '@/services/api'
import type { JourneyEntry } from '@/types'

export interface UseJourneyOptions {
  featured?: boolean
}

/** Fetches the journey timeline via journeyService. Mirrors useCertificates. */
export function useJourney(options?: UseJourneyOptions) {
  const [entries, setEntries] = useState<JourneyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const featured = options?.featured

  const reload = useCallback(() => setReloadKey((prev) => prev + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await journeyService.list({ featured })
        if (!cancelled) {
          setEntries(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Failed to load journey'
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
  }, [featured, reloadKey])

  return { entries, loading, error, reload }
}
