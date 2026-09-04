import type { JourneyEntry } from '@/types'

export interface CurrentFocusProps {
  entries: JourneyEntry[]
}

/** Compact bullet list of entries flagged `featured` — the ongoing/current work. */
export function CurrentFocus({ entries }: CurrentFocusProps) {
  if (entries.length === 0) return null

  return (
    <div className="rounded-md border border-border bg-surface p-6">
      <span className="text-label text-text-tertiary">Current focus</span>
      <ul className="mt-4 flex flex-col gap-2.5">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-baseline gap-2.5 text-body text-text-secondary">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {entry.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
