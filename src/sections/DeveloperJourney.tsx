import { Link } from 'react-router-dom'
import { ArrowUpRight, Milestone } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button, Skeleton } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useJourney } from '@/hooks/useJourney'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/lib/utils'

const PREVIEW_COUNT = 3

/**
 * Compact homepage preview — the last few timeline entries (the API
 * sorts oldest → newest, so the tail is the most recent milestones).
 */
export function DeveloperJourney() {
  const { entries, loading, error } = useJourney()
  const preview = entries.slice(-PREVIEW_COUNT)

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Timeline"
          title="Developer Journey"
          description="A short timeline preview."
          action={
            !loading && !error && entries.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={ROUTES.journey}>
                  View journey
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>
      <div className="mt-10">
        {loading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        )}

        {!loading && (error || entries.length === 0) && (
          <Reveal delay={0.05}>
            <EmptyState icon={Milestone} title="Journey timeline coming soon" />
          </Reveal>
        )}

        {!loading && !error && preview.length > 0 && (
          <Reveal delay={0.05}>
            <div className="flex flex-col">
              {preview.map((entry) => {
                const year = formatDate(entry.date, { year: 'numeric' })
                return (
                  <div
                    key={entry.id}
                    className="flex items-baseline gap-4 border-b border-border py-4 first:pt-0 last:border-b-0"
                  >
                    {year && <span className="font-mono text-caption text-text-tertiary">{year}</span>}
                    <span className="text-body font-medium text-text">{entry.title}</span>
                  </div>
                )
              })}
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  )
}
