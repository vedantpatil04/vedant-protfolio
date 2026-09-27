import { Link } from 'react-router-dom'
import { ArrowUpRight, Milestone } from 'lucide-react'
import { motion } from 'framer-motion'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button, Skeleton } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useJourney } from '@/hooks/useJourney'
import { ROUTES } from '@/constants/routes'
import { JOURNEY_CATEGORY_LABELS } from '@/constants/content-labels'
import { formatDate } from '@/lib/utils'
import { fadeUp, revealViewport, ruleDraw, spineDraw, staggerContainer } from '@/lib/motion'

const PREVIEW_COUNT = 3

/**
 * Compact homepage preview — the last few timeline entries (the API
 * sorts oldest → newest, so the tail is the most recent milestones),
 * read left → right on wide screens along a single drawn line, and
 * top → bottom along a spine on phones.
 */
export function DeveloperJourney() {
  const { entries, loading, error } = useJourney()
  const preview = entries.slice(-PREVIEW_COUNT)

  return (
    <Section id="journey">
      <Reveal>
        <SectionHeader
          index={5}
          eyebrow="Timeline"
          title="Developer Journey"
          description="How the work got here — the most recent chapters."
          action={
            !loading && !error && entries.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={ROUTES.journey}>
                  Full journey
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10 sm:mt-14">
        {loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && (error || entries.length === 0) && (
          <Reveal delay={0.05}>
            <EmptyState icon={Milestone} title="Journey timeline coming soon" />
          </Reveal>
        )}

        {!loading && !error && preview.length > 0 && (
          <motion.ol
            className="relative grid grid-cols-1 md:grid-cols-3 md:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={staggerContainer(0.12)}
          >
            {/* Horizontal line (md+) */}
            <motion.span
              aria-hidden="true"
              variants={ruleDraw}
              className="absolute inset-x-0 top-[5px] hidden h-px origin-left bg-border-strong md:block"
            />
            {/* Vertical spine (mobile) */}
            <motion.span
              aria-hidden="true"
              variants={spineDraw}
              className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-border-strong md:hidden"
            />
            {preview.map((entry) => {
              const year = formatDate(entry.date, { year: 'numeric' })
              const category = entry.category ? JOURNEY_CATEGORY_LABELS[entry.category] : null
              return (
                <motion.li key={entry.id} variants={fadeUp} className="relative pb-10 pl-8 last:pb-0 md:pb-0 md:pl-0 md:pt-9">
                  <span
                    aria-hidden="true"
                    className={
                      entry.featured
                        ? 'absolute left-0 top-0 size-[11px] border border-accent bg-accent md:top-0'
                        : 'absolute left-0 top-0 size-[11px] border border-accent bg-bg md:top-0'
                    }
                  />
                  <p className="text-label flex items-center gap-2 text-text-tertiary">
                    {year && <span className="tabular text-accent">{year}</span>}
                    {category && (
                      <>
                        <span aria-hidden="true" className="text-border-strong">/</span>
                        <span>{category}</span>
                      </>
                    )}
                    {entry.featured && (
                      <>
                        <span aria-hidden="true" className="text-border-strong">/</span>
                        <span className="text-text-secondary">Now</span>
                      </>
                    )}
                  </p>
                  <h3 className="mt-3 text-h3 text-text">{entry.title}</h3>
                  {entry.description && (
                    <p className="mt-2 max-w-[42ch] text-body-sm text-text-secondary line-clamp-3">{entry.description}</p>
                  )}
                </motion.li>
              )
            })}
          </motion.ol>
        )}
      </div>
    </Section>
  )
}
