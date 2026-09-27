/**
 * Design tokens referenced from TypeScript (non-CSS contexts: motion
 * durations, breakpoint checks, etc). The CSS source of truth for
 * color/typography/radius lives in src/index.css (@theme block).
 * Keep the two in sync when either changes.
 */

export const BREAKPOINTS = {
  xs: 375,
  sm: 430,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
} as const

/** Spacing scale (px) — the only values components should reach for. */
export const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const

/** Standard section vertical rhythm, applied via the <Section> component. */
export const SECTION_SPACING = {
  mobile: '4rem',
  desktop: '7rem',
} as const

export const CONTAINER_PADDING = {
  mobile: '1.25rem',
  tablet: '2rem',
  desktop: '4rem',
} as const

/** Mirrors --duration-* in index.css and DURATION in lib/motion.ts (ms). */
export const MOTION_DURATION = {
  fast: 180,
  base: 240,
  medium: 550,
  slow: 800,
} as const
