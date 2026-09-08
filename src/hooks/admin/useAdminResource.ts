import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/services/api'

export interface AdminResourceConfig<T> {
  list: () => Promise<T[]>
  create: (input: Partial<T>) => Promise<T>
  update: (id: string, input: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<unknown>
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return fallback
}

/**
 * Shared list + mutate hook for every admin content resource
 * (Projects, Certificates, Achievements, Skills, Education,
 * Experience, Journey). Keeps the list in sync after every mutation
 * by reloading from the API rather than guessing the new state
 * locally (Phase 8 spec §34/§44 — featured/state must reflect real
 * backend data, never only local state).
 */
export function useAdminResource<T>(config: AdminResourceConfig<T>, resourceLabel: string) {
  const { toast } = useToast()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutating, setMutating] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((prev) => prev + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await config.list()
        if (!cancelled) {
          setItems(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err, `Failed to load ${resourceLabel.toLowerCase()}`))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  const create = useCallback(
    async (input: Partial<T>) => {
      setMutating(true)
      try {
        const created = await config.create(input)
        toast({ title: `${resourceLabel} added.`, variant: 'success' })
        reload()
        return created
      } finally {
        setMutating(false)
      }
    },
    [config, resourceLabel, reload, toast],
  )

  const update = useCallback(
    async (id: string, input: Partial<T>, options?: { silent?: boolean }) => {
      setMutating(true)
      try {
        const updated = await config.update(id, input)
        if (!options?.silent) {
          toast({ title: `${resourceLabel} updated.`, variant: 'success' })
          reload()
        }
        return updated
      } finally {
        setMutating(false)
      }
    },
    [config, resourceLabel, reload, toast],
  )

  const remove = useCallback(
    async (id: string) => {
      setMutating(true)
      try {
        await config.remove(id)
        toast({ title: `${resourceLabel} deleted.`, variant: 'success' })
        reload()
      } catch (err) {
        toast({
          title: `Couldn't delete ${resourceLabel.toLowerCase()}`,
          description: errorMessage(err, 'Something went wrong. Try again.'),
          variant: 'error',
        })
        throw err
      } finally {
        setMutating(false)
      }
    },
    [config, resourceLabel, reload, toast],
  )

  return { items, loading, error, mutating, reload, create, update, remove }
}
