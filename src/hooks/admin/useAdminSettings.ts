import { useCallback, useEffect, useState } from 'react'
import { settingsService, type SiteSettings } from '@/services'
import { ApiError } from '@/services/api'
import { useToast } from '@/hooks/useToast'

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return 'Failed to load settings'
}

/** SiteSettings is a singleton document — get + update only, no list/create/delete. */
export function useAdminSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await settingsService.get()
        if (!cancelled) setSettings(data)
      } catch (err) {
        if (!cancelled) setError(errorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const save = useCallback(
    async (input: Partial<SiteSettings>) => {
      setSaving(true)
      try {
        const updated = await settingsService.update(input)
        setSettings(updated)
        toast({ title: 'Settings updated.', variant: 'success' })
        return updated
      } finally {
        setSaving(false)
      }
    },
    [toast],
  )

  return { settings, loading, error, saving, save }
}
