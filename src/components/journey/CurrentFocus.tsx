import type { JourneyEntry } from '@/types'
import { CornerBrackets } from '@/components/shared'

export interface CurrentFocusProps {
  entries: JourneyEntry[]
}

/** Entries flagged `featured` — the ongoing/current work — framed with the site's corner-bracket motif. */
export function CurrentFocus({ entries }: CurrentFocusProps) {
  if (entries.length === 0) return null

  return (
    <div className="relative border border-border bg-surface/70 p-5 sm:p-6">
      <CornerBrackets />
      <span className="text-label flex items-center gap-2 text-text-tertiary">
        <span aria-hidden="true" className="size-1.5 bg-accent" />
        Current focus
      </span>
      <ul className="mt-4 flex flex-col">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="border-b border-border py-3 text-body font-medium text-text first:pt-0 last:border-b-0 last:pb-0"
          >
            {entry.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
