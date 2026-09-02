import { useCallback, useEffect, useState } from 'react'
import { projectService } from '@/services'
import { ApiError } from '@/services/api'
import type { Project } from '@/types'

export interface UseProjectsOptions {
  featured?: boolean
}

/**
 * Fetches the project list via projectService, supporting optional filtering
 * (e.g. featured only).
 */
export function useProjects(options?: UseProjectsOptions) {
  const [projects, setProjects] = useState<Project[]>([])
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
        const data = await projectService.list({ featured })
        if (!cancelled) {
          setProjects(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Failed to load projects'
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
    projects,
    loading,
    error,
    reload,
  }
}
