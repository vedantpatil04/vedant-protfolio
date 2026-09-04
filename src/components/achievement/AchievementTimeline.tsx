import { Fragment } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Achievement } from '@/types'
import { Divider, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export interface AchievementTimelineProps {
  achievements: Achievement[]
}

/** Groups achievements by calendar year, preserving the caller's sort order within each year. */
function groupByYear(achievements: Achievement[]) {
  const groups = new Map<string, Achievement[]>()
  for (const achievement of achievements) {
    const year = new Date(achievement.date).getFullYear()
    const key = Number.isNaN(year) ? 'Undated' : String(year)
    const list = groups.get(key) ?? []
    list.push(achievement)
    groups.set(key, list)
  }
  return groups
}

/**
 * Editorial chronological list, grouped by year — preferred over a
 * card grid per the design spec. Reused by both the /achievements
 * page and (with a slice of the data) the homepage preview.
 */
export function AchievementTimeline({ achievements }: AchievementTimelineProps) {
  const grouped = groupByYear(achievements)

  return (
    <div className="flex flex-col">
      {Array.from(grouped.entries()).map(([year, items]) => (
        <section key={year} aria-label={year === 'Undated' ? 'Undated achievements' : `Achievements from ${year}`}>
          <div className="pb-3 pt-8 first:pt-0">
            <span className="font-mono text-h3 text-text-tertiary">{year}</span>
          </div>
          <Divider />
          {items.map((achievement) => {
            const date = formatDate(achievement.date, { month: 'short', day: 'numeric', year: 'numeric' })
            return (
              <Fragment key={achievement.id}>
                <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-h3 text-text">{achievement.title}</h3>
                      {achievement.category && (
                        <Badge variant="neutral" className="capitalize">
                          {achievement.category}
                        </Badge>
                      )}
                    </div>
                    {achievement.organization && (
                      <p className="text-body-sm text-text-tertiary">{achievement.organization}</p>
                    )}
                    <p className="max-w-2xl whitespace-pre-line text-body text-text-secondary">
                      {achievement.description}
                    </p>
                    {achievement.url && (
                      <a
                        href={achievement.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex w-fit items-center gap-1.5 text-body-sm font-medium text-accent hover:underline"
                      >
                        View
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-row items-start gap-4 sm:flex-col sm:items-end sm:text-right">
                    {date && <span className="font-mono text-caption text-text-tertiary">{date}</span>}
                    {achievement.imageUrl && (
                      <img
                        src={achievement.imageUrl}
                        alt={`${achievement.title} photo`}
                        loading="lazy"
                        className="h-20 w-28 shrink-0 rounded-md border border-border object-cover"
                      />
                    )}
                  </div>
                </div>
                <Divider />
              </Fragment>
            )
          })}
        </section>
      ))}
    </div>
  )
}
