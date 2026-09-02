import { useCallback, useEffect, useState } from 'react'
import { projectService } from '@/services'
import { ApiError } from '@/services/api'
import type { Project } from '@/types'

/**
 * Fetches a single project by slug via projectService. Handles 404
 * not-found state separately from other network/server errors.
 */
export function useProject(slug?: string) {
  const [project, setProject] = useState<Project | null>(null)
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
      if (!slug) {
        if (!cancelled) {
          setProject(null)
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      try {
        const data = await projectService.getBySlug(slug)
        if (!cancelled) {
          if (!data) {
            setNotFound(true)
            setProject(null)
          } else {
            setProject(data)
            setNotFound(false)
          }
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setNotFound(true)
            setProject(null)
          } else {
            const message =
              err instanceof ApiError
                ? err.message
                : err instanceof Error
                  ? err.message
                  : 'Failed to load project'
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
  }, [slug, reloadKey])

  return {
    project,
    loading,
    notFound,
    error,
    reload,
  }
}
