import { createContext } from 'react'

/**
 * playing   → the fullscreen greeting sequence is on screen
 * revealing → the overlay is wiping away; the Hero starts its entrance
 * done      → normal site (also the initial state when the intro is skipped
 *             for this session, or the visitor landed on another route)
 */
export type IntroPhase = 'playing' | 'revealing' | 'done'

export interface IntroContextValue {
  phase: IntroPhase
  /** Ends the sequence early (Skip button / Escape) or when it finishes. */
  reveal: () => void
  /** Called once the exit wipe has fully completed. */
  finish: () => void
}

export const IntroContext = createContext<IntroContextValue>({
  phase: 'done',
  reveal: () => {},
  finish: () => {},
})
