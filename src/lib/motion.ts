import type { Transition, Variants } from 'framer-motion'

/**
 * Centralized motion language for the portfolio.
 * Principles: fast, subtle, purposeful, natural.
 * Every animated component should pull from here rather than
 * inventing bespoke durations/easings inline.
 *
 * Vocabulary (Phase 10):
 *   fast   → micro-interactions (hover, press, icon nudges)
 *   medium → section / element reveals
 *   slow   → major transitions (intro exit, image reveals)
 * `base` is kept for page-level enter timing and backwards compatibility.
 *
 * Reduced motion: <MotionConfig reducedMotion="user"> at the app root
 * turns transform/layout animation off for users who ask for it, so
 * these variants degrade to opacity-only fades automatically.
 */

export const EASE_OUT_EXPO: Transition['ease'] = [0.22, 1, 0.36, 1]
export const EASE_STANDARD: Transition['ease'] = [0.4, 0, 0.2, 1]
export const EASE_IN_OUT: Transition['ease'] = [0.76, 0, 0.24, 1]

export const DURATION = {
  fast: 0.18,
  base: 0.26,
  medium: 0.55,
  slow: 0.8,
} as const

/** Small upward fade — the default section / element reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO },
  },
}

/** Plain fade, no displacement — for images and large surfaces. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO },
  },
}

/**
 * Masked line reveal — the child slides up out of an overflow-hidden
 * parent. Used for display type (hero name, intro) only.
 */
export const maskUp: Variants = {
  hidden: { y: '108%' },
  visible: {
    y: '0%',
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
}

/** Hairline rule that draws in from the left — section headers, timelines. */
export const ruleDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
}

/** Vertical variant for timeline spines. */
export const spineDraw: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.1, ease: EASE_OUT_EXPO },
  },
}

/** Image reveal — a clip wipe upward with a gentle settle in scale. */
export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.04 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: DURATION.slow + 0.2, ease: EASE_OUT_EXPO },
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

/** Page-level transition used by route changes — short, never cinematic. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium * 0.8, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: DURATION.fast, ease: EASE_STANDARD },
  },
}

/** Shared viewport config for scroll-triggered reveals. */
export const revealViewport = { once: true, margin: '0px 0px -12% 0px' } as const
