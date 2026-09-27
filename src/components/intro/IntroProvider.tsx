import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { IntroContext, type IntroPhase } from './intro-context'
import { INTRO_SESSION_KEY } from '@/constants/intro'

/**
 * Decided exactly once per page load (module scope, so StrictMode's
 * double-invoked initializers can't disagree). The intro plays only when:
 *  - the session's first document load is the homepage, and
 *  - it hasn't already played in this tab's session.
 * Internal navigation back to "/" never replays it. sessionStorage is
 * per-tab and cleared when the tab closes — no persistent tracking.
 * If storage is unavailable (privacy mode), it plays once for this load.
 */
function decideInitialPhase(): IntroPhase {
  if (typeof window === 'undefined') return 'done'
  if (window.location.pathname !== '/') return 'done'
  try {
    if (window.sessionStorage.getItem(INTRO_SESSION_KEY)) return 'done'
    window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
  } catch {
    /* storage blocked — fall through and play for this load only */
  }
  return 'playing'
}

const INITIAL_PHASE = decideInitialPhase()

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>(INITIAL_PHASE)

  const reveal = useCallback(() => {
    setPhase((current) => (current === 'playing' ? 'revealing' : current))
  }, [])

  const finish = useCallback(() => setPhase('done'), [])

  // Lock page scroll while the overlay is up, and start from the top.
  useEffect(() => {
    if (phase === 'done') return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      root.style.overflow = previous
    }
  }, [phase])

  const value = useMemo(() => ({ phase, reveal, finish }), [phase, reveal, finish])

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
}
