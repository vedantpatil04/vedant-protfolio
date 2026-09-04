import { useCallback, useEffect, useState } from 'react'
import { certificateService } from '@/services'
import { ApiError } from '@/services/api'
import type { Certificate } from '@/types'

export interface UseCertificatesOptions {
  featured?: boolean
}

/**
 * Fetches the certificate list via certificateService, supporting
 * optional featured-only filtering. Mirrors useProjects.
 */
export function useCertificates(options?: UseCertificatesOptions) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
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
        const data = await certificateService.list({ featured })
        if (!cancelled) {
          setCertificates(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Failed to load certificates'
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
    certificates,
    loading,
    error,
    reload,
  }
}
