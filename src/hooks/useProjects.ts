import { useCallback, useEffect, useState } from 'react'
import { projectService } from '@/services'
import { ApiError } from '@/services/api'
import type { Project } from '@/types'

export interface UseProjectsOptions {
  featured?: boolean
}

/**
 * In-flight request de-duplication. Several homepage sections read the
 * same project list at mount (skills evidence, case studies); sharing
 * the pending promise means one network request instead of several.
 * Entries are removed as soon as the request settles, so this is not a
 * cache — every later mount/reload still fetches fresh data.
 */
const inFlight = new Map<string, Promise<Project[]>>()

function fetchProjects(featured?: boolean): Promise<Project[]> {
  const key = featured ? 'featured' : 'all'
  const pending = inFlight.get(key)
  if (pending) return pending
  const request = projectService.list({ featured }).finally(() => inFlight.delete(key))
  inFlight.set(key, request)
  return request
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
        const data = await fetchProjects(featured)
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
