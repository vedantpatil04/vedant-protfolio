import { useCallback, useEffect, useState } from 'react'
import { certificateService } from '@/services'
import { ApiError } from '@/services/api'
import type { Certificate } from '@/types'

/**
 * Fetches a single certificate by id via certificateService. Handles
 * 404 not-found state separately from other network/server errors.
 * Mirrors useProject (which does the same for slug-based projects).
 */
export function useCertificate(id?: string) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [notFound, setNotFound] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!id) {
        if (!cancelled) {
          setCertificate(null)
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      try {
        const data = await certificateService.getById(id)
        if (!cancelled) {
          if (!data) {
            setNotFound(true)
            setCertificate(null)
          } else {
            setCertificate(data)
            setNotFound(false)
          }
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setNotFound(true)
            setCertificate(null)
          } else {
            const message =
              err instanceof ApiError
                ? err.message
                : err instanceof Error
                  ? err.message
                  : 'Failed to load certificate'
            setError(message)
          }
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
  }, [id, reloadKey])

  return {
    certificate,
    loading,
    notFound,
    error,
    reload,
  }
}
