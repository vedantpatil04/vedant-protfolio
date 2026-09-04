import type { Education } from '@/types'
import { Divider } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export interface EducationListProps {
  education: Education[]
}

/**
 * First entry (lowest `order`) renders as the primary degree card;
 * everything after it renders as compact prior-education rows below —
 * matches the spec's "BCA hero card, then Class XII / Class X rows"
 * structure without hardcoding a fixed count.
 */
export function EducationList({ education }: EducationListProps) {
  const [primary, ...rest] = education
  if (!primary) return null

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-md border border-border bg-surface p-6">
        <h3 className="text-h3 text-text text-balance">{primary.degree}</h3>
        <p className="mt-1.5 text-body text-text-secondary">{primary.institution}</p>
        {primary.grade && (
          <>
            <Divider className="my-5" />
            <div className="flex items-baseline justify-between">
              <span className="text-caption text-text-tertiary">Aggregate</span>
              <span className="font-mono text-body font-medium text-text">{primary.grade}</span>
            </div>
          </>
        )}
      </div>

      {rest.length > 0 && (
        <div className="flex flex-col">
          {rest.map((entry) => {
            const year = formatDate(entry.endDate ?? entry.startDate, { year: 'numeric' })
            return (
              <div key={entry.id} className="flex items-baseline justify-between gap-4 border-b border-border py-4 last:border-b-0">
                <div>
                  <span className="text-body-sm font-medium text-text">{entry.degree}</span>
                  {year && <span className="ml-2 font-mono text-caption text-text-tertiary">{year}</span>}
                </div>
                {entry.grade && <span className="font-mono text-body-sm text-text-secondary">{entry.grade}</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
