import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { pageTransition } from '@/lib/motion'

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      {children}
    </motion.div>
  )
}
