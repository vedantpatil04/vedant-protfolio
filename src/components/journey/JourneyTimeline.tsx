import type { JourneyEntry } from '@/types'
import { Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export interface JourneyTimelineProps {
  entries: JourneyEntry[]
}

/**
 * Editorial timeline — a date column beside a content column, divided
 * by thin borders. Entries are rendered in the order the caller passes
 * (the API already sorts oldest → newest, "how I got here").
 */
export function JourneyTimeline({ entries }: JourneyTimelineProps) {
  return (
    <ol className="flex flex-col">
      {entries.map((entry) => {
        const date = formatDate(entry.date, { year: 'numeric' })
        return (
          <li
            key={entry.id}
            className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-b border-border py-8 first:pt-0 last:border-b-0 sm:grid-cols-[6rem_1fr] sm:gap-x-8"
          >
            <div className="flex flex-col items-start gap-1.5 pt-1">
              {date && <span className="font-mono text-body-sm text-text-tertiary">{date}</span>}
              {entry.featured && <Badge variant="accent">Current</Badge>}
            </div>
            <div className="flex flex-col gap-1.5 border-l border-border pl-6">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-h3 text-text">{entry.title}</h3>
                {entry.category && (
                  <Badge variant="neutral" className="capitalize">
                    {entry.category}
                  </Badge>
                )}
              </div>
              {entry.organization && <p className="text-body-sm text-text-tertiary">{entry.organization}</p>}
              <p className="max-w-xl whitespace-pre-line text-body text-text-secondary">{entry.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
