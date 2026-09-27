import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/components/shared/ThemeProvider'
import { IconButton, Tooltip } from '@/components/ui'
import { EASE_OUT_EXPO } from '@/lib/motion'

const ORDER: Theme[] = ['light', 'dark', 'system']
const ICON: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor }
const LABEL: Record<Theme, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
}

/**
 * Cycles light → dark → system on each click; icon reflects current
 * choice and swaps with a short rotate/fade (a fast micro-interaction).
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = ICON[theme]
  const nextTheme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]

  return (
    <Tooltip content={`${LABEL[theme]} · switch to ${LABEL[nextTheme].toLowerCase()}`}>
      <IconButton
        variant="ghost"
        size="md"
        onClick={() => setTheme(nextTheme)}
        aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
        className="overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className="inline-flex"
            initial={{ opacity: 0, rotate: -45, y: 6 }}
            animate={{ opacity: 1, rotate: 0, y: 0, transition: { duration: 0.22, ease: EASE_OUT_EXPO } }}
            exit={{ opacity: 0, rotate: 45, y: -6, transition: { duration: 0.12 } }}
          >
            <Icon className="size-4" aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  )
}
