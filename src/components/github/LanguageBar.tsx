import { motion } from 'framer-motion'
import type { LanguageStat } from '@/types'
import { revealViewport, ruleDraw } from '@/lib/motion'

export interface LanguageBarProps {
  languages: LanguageStat[]
}

/** Restrained, theme-aware scale: the leading language in accent, the rest stepping down. */
const SHADES = ['bg-accent', 'bg-accent/60', 'bg-accent/35', 'bg-text-tertiary/50', 'bg-text-tertiary/30', 'bg-border-strong']

/**
 * Shows language mix by repository count (not byte count — the REST API's
 * repo list already gives us the primary language for free, avoiding an
 * extra per-repo API call for a marginally more precise figure).
 * Monochrome gold scale instead of hashed rainbow hues, so it sits in the
 * site's palette in both themes; the legend carries the same info as text.
 */
export function LanguageBar({ languages }: LanguageBarProps) {
  if (languages.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        className="flex h-1.5 w-full origin-left gap-[3px]"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={ruleDraw}
        aria-hidden="true"
      >
        {languages.map((lang, i) => (
          <span
            key={lang.language}
            className={SHADES[Math.min(i, SHADES.length - 1)]}
            style={{ width: `${lang.percentage}%` }}
          />
        ))}
      </motion.div>
      <ul className="flex flex-col">
        {languages.map((lang, i) => (
          <li
            key={lang.language}
            className="flex items-center justify-between gap-4 border-b border-border py-2.5 text-body-sm last:border-b-0"
          >
            <span className="flex items-center gap-2.5 text-text">
              <span className={`size-2 ${SHADES[Math.min(i, SHADES.length - 1)]}`} aria-hidden="true" />
              {lang.language}
            </span>
            <span className="font-mono text-caption text-text-tertiary tabular">
              {lang.percentage}% · {lang.repoCount} repo{lang.repoCount === 1 ? '' : 's'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
