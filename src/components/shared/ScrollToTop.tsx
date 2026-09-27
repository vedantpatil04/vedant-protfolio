import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Route scroll management.
 * - Scroll-to-top on route change is performed by App's AnimatePresence
 *   `onExitComplete`, i.e. after the outgoing page has faded, so the old
 *   page never visibly jumps mid-transition.
 * - This component handles hash targets (e.g. /about#skills from a
 *   homepage section): it waits for the incoming page to mount and for
 *   the target to exist (data may still be loading), then scrolls to it.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const targetId = decodeURIComponent(hash.slice(1))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let attempts = 0
    let timer = 0

    const attempt = () => {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
        return
      }
      if (attempts++ < 25) timer = window.setTimeout(attempt, 120)
    }

    timer = window.setTimeout(attempt, 380)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return null
}
