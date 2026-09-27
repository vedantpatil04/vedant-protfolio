import { motion } from 'framer-motion'
import type { JourneyEntry } from '@/types'
import { JOURNEY_CATEGORY_LABELS } from '@/constants/content-labels'
import { formatDate } from '@/lib/utils'
import { fadeUp, revealViewport, spineDraw } from '@/lib/motion'

export interface JourneyTimelineProps {
  entries: JourneyEntry[]
}

/**
 * The full journey as a story, not a pasted resume: a date rail, a
 * spine that draws down as the timeline enters view, and one milestone
 * per chapter. Current (featured) entries get a filled node and a "Now"
 * marker. Entries are rendered in the order the caller passes (the API
 * already sorts oldest → newest, "how I got here").
 */
export function JourneyTimeline({ entries }: JourneyTimelineProps) {
  return (
    <div className="relative">
      <motion.span
        aria-hidden="true"
        className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-border-strong sm:left-[calc(7rem+1.5rem)] lg:left-[calc(9rem+1.75rem)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        variants={spineDraw}
      />
      <ol className="flex flex-col">
        {entries.map((entry) => {
          const date = formatDate(entry.date, { month: 'short', year: 'numeric' })
          const year = formatDate(entry.date, { year: 'numeric' })
          const category = entry.category ? JOURNEY_CATEGORY_LABELS[entry.category] : null
          return (
            <motion.li
              key={entry.id}
              className="relative grid grid-cols-1 pb-12 pl-8 last:pb-0 sm:grid-cols-[7rem_1fr] sm:gap-x-12 sm:pl-0 lg:grid-cols-[9rem_1fr] lg:gap-x-14"
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={fadeUp}
            >
              {/* Date rail */}
              <div className="mb-3 flex items-baseline gap-3 sm:mb-0 sm:flex-col sm:items-end sm:gap-1 sm:pt-0.5 sm:text-right">
                {year && (
                  <span className="font-display text-[1.5rem] font-extrabold leading-none tracking-[-0.03em] text-text tabular sm:text-[1.75rem]">
                    {year}
                  </span>
                )}
                {date && <span className="text-label text-text-tertiary">{date.split(' ')[0]}</span>}
              </div>

              {/* Node */}
              <span
                aria-hidden="true"
                className={
                  'absolute left-0 top-1.5 size-[11px] border border-accent sm:left-[calc(7rem+1.5rem-5px)] lg:left-[calc(9rem+1.75rem-5px)] ' +
                  (entry.featured ? 'bg-accent' : 'bg-bg')
                }
              />

              {/* Content */}
              <div className="flex min-w-0 flex-col sm:pl-3 lg:pl-4">
                <p className="text-label flex flex-wrap items-center gap-x-2 gap-y-1 text-text-tertiary">
                  {category && <span>{category}</span>}
                  {entry.featured && (
                    <>
                      {category && <span aria-hidden="true" className="text-border-strong">/</span>}
                      <span className="text-accent">Now</span>
                    </>
                  )}
                </p>
                <h3 className="mt-2 text-h3 text-text">{entry.title}</h3>
                {entry.organization && (
                  <p className="mt-1 text-body-sm font-medium text-text-secondary">{entry.organization}</p>
                )}
                {entry.description && (
                  <p className="mt-3 max-w-[62ch] whitespace-pre-line text-body text-text-secondary">
                    {entry.description}
                  </p>
                )}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
