import type { LanguageStat } from '@/types'
import { languageColor } from './language-color'

export interface LanguageBarProps {
  languages: LanguageStat[]
}

/**
 * Shows language mix by repository count (not byte count — the REST API's
 * repo list already gives us the primary language for free, avoiding an
 * extra per-repo API call for a marginally more precise figure).
 */
export function LanguageBar({ languages }: LanguageBarProps) {
  if (languages.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-2">
        {languages.map((lang) => (
          <span
            key={lang.language}
            style={{ width: `${lang.percentage}%`, backgroundColor: languageColor(lang.language) }}
            title={`${lang.language} — ${lang.percentage}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {languages.map((lang) => (
          <span key={lang.language} className="flex items-center gap-1.5 text-caption text-text-secondary">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: languageColor(lang.language) }}
              aria-hidden="true"
            />
            {lang.language}
            <span className="text-text-tertiary">{lang.percentage}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}
