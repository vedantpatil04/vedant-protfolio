import { ArrowUpRight } from 'lucide-react'
import type { Achievement } from '@/types'
import { ACHIEVEMENT_CATEGORY_LABELS } from '@/constants/content-labels'
import { Reveal } from '@/components/shared'
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
 * Editorial chronological record, grouped by year. On wide screens the
 * year sits in a sticky left rail while its milestones scroll past;
 * on small screens the year becomes a heading above its entries.
 * Each milestone reveals on its own as it enters the viewport.
 */
export function AchievementTimeline({ achievements }: AchievementTimelineProps) {
  const grouped = groupByYear(achievements)

  return (
    <div className="flex flex-col">
      {Array.from(grouped.entries()).map(([year, items]) => (
        <section
          key={year}
          aria-label={year === 'Undated' ? 'Undated achievements' : `Achievements from ${year}`}
          className="grid grid-cols-1 border-t border-border lg:grid-cols-12 lg:gap-10"
        >
          <div className="pb-2 pt-6 lg:col-span-3 lg:pb-10 lg:pt-8">
            <h2 className="font-display text-[clamp(2rem,1.5rem+2vw,3.25rem)] font-extrabold leading-none tracking-[-0.04em] text-text-tertiary tabular lg:sticky lg:top-28">
              {year}
            </h2>
          </div>

          <ol className="lg:col-span-9">
            {items.map((achievement) => {
              const date = formatDate(achievement.date, { month: 'short', day: 'numeric', year: 'numeric' })
              const category = achievement.category ? ACHIEVEMENT_CATEGORY_LABELS[achievement.category] : null
              return (
                <li key={achievement.id} className="border-b border-border last:border-b-0">
                  <Reveal>
                    <article className="grid grid-cols-1 gap-5 py-7 sm:grid-cols-[1fr_auto] sm:gap-10 lg:py-8">
                      <div className="flex min-w-0 flex-col">
                        <p className="text-label flex flex-wrap items-center gap-x-2 gap-y-1 text-text-tertiary">
                          {date && <time dateTime={achievement.date} className="tabular">{date}</time>}
                          {date && category && <span aria-hidden="true" className="text-border-strong">/</span>}
                          {category && <span>{category}</span>}
                        </p>
                        <h3 className="mt-3 text-h3 text-text">{achievement.title}</h3>
                        {achievement.organization && (
                          <p className="mt-1 text-body-sm font-medium text-text-secondary">{achievement.organization}</p>
                        )}
                        {achievement.description && (
                          <p className="mt-3 max-w-[62ch] whitespace-pre-line text-body text-text-secondary">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.url && (
                          <a
                            href={achievement.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nudge-icons mt-4 inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-accent"
                          >
                            <span className="link-underline">View details</span>
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        )}
                      </div>

                      {achievement.imageUrl && (
                        <img
                          src={achievement.imageUrl}
                          alt={`${achievement.title} photo`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full max-w-xs rounded-md border border-border object-cover sm:w-44"
                        />
                      )}
                    </article>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
