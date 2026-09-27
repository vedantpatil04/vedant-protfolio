/**
 * Signature multilingual intro — the greeting sequence and its pacing.
 * Kept as data so copy/timing can be tuned without touching the
 * component. `lang` is set on each word so screen readers, hyphenation
 * and font fallback all pick the correct script.
 *
 * Total runtime ≈ 3.8s + a 0.85s exit wipe; skippable at any point.
 */
export interface IntroGreeting {
  id: string
  text: string
  lang: string
  /** How long the word holds before the next one takes over (ms). */
  hold: number
}

export const INTRO_GREETINGS: IntroGreeting[] = [
  { id: 'namaste-latn', text: 'Namaste', lang: 'en', hold: 560 },
  { id: 'namaste-hi', text: 'नमस्ते', lang: 'hi', hold: 400 },
  { id: 'namaskara-kn', text: 'ನಮಸ್ಕಾರ', lang: 'kn', hold: 400 },
  { id: 'namaskar-mr', text: 'नमस्कार', lang: 'mr', hold: 400 },
  { id: 'hello', text: 'Hello', lang: 'en', hold: 380 },
  { id: 'hello-world', text: 'Hello, World.', lang: 'en', hold: 700 },
]

/** Hold on the final "VEDANT PATIL / FULL-STACK DEVELOPER" frame before revealing the Hero (ms). */
export const INTRO_FINAL_HOLD = 950

/** Reduced-motion variant: only the final frame, opacity-only (ms). */
export const INTRO_REDUCED_HOLD = 700

/** sessionStorage key — per-tab session only, never persisted beyond it. */
export const INTRO_SESSION_KEY = 'vp-intro-played'
