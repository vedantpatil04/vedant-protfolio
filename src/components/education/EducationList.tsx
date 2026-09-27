import type { Education } from '@/types'
import { formatDate } from '@/lib/utils'
import { formatGrade } from './grade'

export interface EducationListProps {
  education: Education[]
  /** `wide` spreads the primary degree and prior records side by side (homepage). */
  layout?: 'stacked' | 'wide'
  /** Heading level for the degree titles. */
  titleAs?: 'h3' | 'h4'
}

/**
 * First entry (lowest `order`) renders as the primary degree with its
 * aggregate as a clear figure; everything after it renders as compact
 * prior-education rows with grades right-aligned in tabular numerals so
 * the percentages line up. No expected-graduation or other invented
 * dates — only what the record holds.
 */
export function EducationList({ education, layout = 'stacked', titleAs = 'h3' }: EducationListProps) {
  const Title = titleAs
  const [primary, ...rest] = education
  if (!primary) return null
  const primaryGrade = formatGrade(primary.grade)

  return (
    <div
      className={
        layout === 'wide'
          ? 'grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10'
          : 'flex flex-col gap-8'
      }
    >
      <div className={layout === 'wide' ? 'lg:col-span-7' : undefined}>
        <div className="border-t border-border pt-6">
          <span className="text-label text-text-tertiary">Degree</span>
          <Title className="mt-3 font-display text-[clamp(1.4rem,1.15rem+1vw,2rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-text">
            {primary.degree}
          </Title>
          <p className="mt-2 text-body text-text-secondary">{primary.institution}</p>

          {primaryGrade && (
            <div className="mt-7 flex items-end justify-between gap-6 border-t border-border pt-5">
              <span className="text-label text-text-tertiary">{primaryGrade.label}</span>
              <span className="font-display text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] font-extrabold leading-none tracking-[-0.03em] text-text tabular">
                {primaryGrade.value}
              </span>
            </div>
          )}
        </div>
      </div>

      {rest.length > 0 && (
        <div className={layout === 'wide' ? 'lg:col-span-5' : undefined}>
          <div className="border-t border-border pt-6">
            <span className="text-label text-text-tertiary">Earlier</span>
            <ul className="mt-2">
              {rest.map((entry) => {
                const year = formatDate(entry.endDate ?? entry.startDate, { year: 'numeric' })
                const grade = formatGrade(entry.grade)
                return (
                  <li
                    key={entry.id}
                    className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-0.5 border-b border-border py-4 last:border-b-0"
                  >
                    <span className="text-body font-medium text-text">{entry.degree}</span>
                    <span className="row-span-2 self-center text-right font-mono text-body text-text tabular">
                      {grade?.value ?? '—'}
                    </span>
                    <span className="text-body-sm text-text-tertiary">
                      {entry.institution}
                      {year && <span className="tabular"> · {year}</span>}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
