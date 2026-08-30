import type { Transition, Variants } from 'framer-motion'

/**
 * Centralized motion language for the portfolio.
 * Principles: fast, subtle, purposeful, natural.
 * Every animated component should pull from here rather than
 * inventing bespoke durations/easings inline.
 */

export const EASE_OUT_EXPO: Transition['ease'] = [0.22, 1, 0.36, 1]
export const EASE_STANDARD: Transition['ease'] = [0.4, 0, 0.2, 1]

export const DURATION = {
  fast: 0.15,
  base: 0.22,
  slow: 0.42,
} as const

/** Small upward fade — the default section / element reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
}

/** Plain fade, no displacement — for images and large surfaces. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
}

/** Stagger wrapper for groups of children (nav items, card grids). */
export const staggerContainer = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
})

/** Page-level transition used by route changes. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.fast, ease: EASE_STANDARD },
  },
}

/** Shared viewport config for scroll-triggered reveals. */
export const revealViewport = { once: true, margin: '-80px 0px -80px 0px' } as const
