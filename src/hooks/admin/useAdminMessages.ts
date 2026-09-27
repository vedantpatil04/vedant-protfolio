import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/services/api'
import { messageService } from '@/services'
import type { Message, MessageStatus } from '@/types'

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return fallback
}

/**
 * List + mutate hook for the admin contact inbox (Phase 9). Deliberately
 * separate from useAdminResource — messages are never created by the
 * admin, only received, read/archived, and deleted — so there's no
 * `create` here and status changes update local state directly instead
 * of always refetching the whole list.
 */
export function useAdminMessages() {
  const { toast } = useToast()
  const [items, setItems] = useState<Message[]>([])
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
        const data = await messageService.list()
        if (!cancelled) {
          setItems(data ?? [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err, 'Failed to load messages'))
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

  const updateStatus = useCallback(
    async (id: string, status: MessageStatus) => {
      setMutating(true)
      try {
        const updated = await messageService.updateStatus(id, status)
        setItems((prev) => prev.map((m) => (m.id === id ? updated : m)))
        return updated
      } catch (err) {
        toast({
          title: "Couldn't update message",
          description: errorMessage(err, 'Something went wrong. Try again.'),
          variant: 'error',
        })
        throw err
      } finally {
        setMutating(false)
      }
    },
    [toast],
  )

  const remove = useCallback(
    async (id: string) => {
      setMutating(true)
      try {
        await messageService.remove(id)
        setItems((prev) => prev.filter((m) => m.id !== id))
        toast({ title: 'Message deleted.', variant: 'success' })
      } catch (err) {
        toast({
          title: "Couldn't delete message",
          description: errorMessage(err, 'Something went wrong. Try again.'),
          variant: 'error',
        })
        throw err
      } finally {
        setMutating(false)
      }
    },
    [toast],
  )

  return { items, loading, error, mutating, reload, updateStatus, remove }
}
