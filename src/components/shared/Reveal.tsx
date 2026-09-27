import { useMemo, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { fadeIn, fadeUp, imageReveal, revealViewport } from '@/lib/motion'

const VARIANTS = { up: fadeUp, fade: fadeIn, image: imageReveal } as const

export interface RevealProps {
  children: ReactNode
  delay?: number
  /** `up` (default) for content blocks, `fade` for large surfaces, `image` for media. */
  variant?: keyof typeof VARIANTS
  className?: string
}

/**
 * Wraps content in the standard scroll-triggered reveal used across
 * section entrances — one reveal vocabulary for the whole site rather
 * than bespoke per-component animation. Reduced motion is handled at
 * the root (<MotionConfig reducedMotion="user">) plus the CSS override
 * in index.css, so this collapses to a plain fade for those users.
 *
 * The delay is merged into the variant's own transition (a transition
 * defined inside a variant takes precedence over the `transition` prop,
 * so passing it separately would be silently ignored).
 */
export function Reveal({ children, delay = 0, variant = 'up', className }: RevealProps) {
  const variants = useMemo<Variants>(() => {
    const base = VARIANTS[variant]
    if (!delay) return base
    const visible = base.visible as { transition?: object }
    return {
      ...base,
      visible: { ...visible, transition: { ...visible.transition, delay } },
    } as Variants
  }, [variant, delay])

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
