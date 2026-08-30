import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/components/shared/ThemeProvider'
import { IconButton } from '@/components/ui'

const ORDER: Theme[] = ['light', 'dark', 'system']
const ICON: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor }
const LABEL: Record<Theme, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
}

/** Cycles light → dark → system on each click; icon reflects current choice. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = ICON[theme]

  const next = () => {
    const index = ORDER.indexOf(theme)
    setTheme(ORDER[(index + 1) % ORDER.length])
  }

  return (
    <IconButton
      variant="ghost"
      size="sm"
      onClick={next}
      aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </IconButton>
  )
}
