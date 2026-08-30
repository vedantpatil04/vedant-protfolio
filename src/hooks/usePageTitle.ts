import { useEffect } from 'react'
import { profile } from '@/data/profile'

/** Sets document.title as `${title} — ${profile.name}` for the lifetime of the page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${profile.name}` : `${profile.name} — ${profile.title}`
  }, [title])
}
