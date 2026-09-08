import { useEffect } from 'react'

/**
 * Warns before closing the tab/refreshing when a form has unsaved
 * edits. The app's router isn't set up as a data router (createBrowserRouter),
 * so in-app navigation blocking (useBlocker) isn't available here —
 * this covers the tab-close/refresh case, which is the one most likely
 * to lose real work (Phase 8 spec §30 calls for a "lightweight"
 * pattern, not a global intrusive warning).
 */
export function useUnsavedChangesWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])
}
