import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, revealViewport } from '@/lib/motion'

/**
 * Wraps content in the standard scroll-triggered reveal used across
 * section entrances. Respects prefers-reduced-motion via framer-motion's
 * global handling combined with the CSS override in index.css.
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
