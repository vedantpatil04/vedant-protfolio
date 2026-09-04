import type { ContributionCalendar } from '@/types'
import { cn } from '@/lib/utils'

export interface ContributionHeatmapProps {
  calendar: ContributionCalendar
}

/**
 * Renders the real GitHub contribution calendar (only ever called with
 * data — the parent section hides this entirely when contributionCalendar
 * is null, i.e. no GITHUB_TOKEN configured server-side). Intensity buckets
 * are computed from the actual max day count in the data, not a fabricated
 * scale.
 */
export function ContributionHeatmap({ calendar }: ContributionHeatmapProps) {
  const maxCount = Math.max(1, ...calendar.weeks.flat().map((d) => d.count))

  function bucket(count: number) {
    if (count === 0) return 0
    const ratio = count / maxCount
    if (ratio > 0.75) return 4
    if (ratio > 0.5) return 3
    if (ratio > 0.25) return 2
    return 1
  }

  const bucketClasses = [
    'bg-surface-2',
    'bg-accent/25',
    'bg-accent/50',
    'bg-accent/75',
    'bg-accent',
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto pb-1">
        <div className="inline-grid grid-flow-col gap-1">
          {calendar.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}
                  className={cn('size-2.5 rounded-[2px]', bucketClasses[bucket(day.count)])}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-caption text-text-tertiary">
        <span>{calendar.totalContributions} contributions in the last year</span>
        <span className="ml-auto flex items-center gap-1">
          Less
          {bucketClasses.map((cls, i) => (
            <span key={i} className={cn('size-2.5 rounded-[2px]', cls)} />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
