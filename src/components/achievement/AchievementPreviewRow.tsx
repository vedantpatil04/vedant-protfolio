import type { Achievement } from '@/types'
import { ACHIEVEMENT_CATEGORY_LABELS } from '@/constants/content-labels'
import { formatDate } from '@/lib/utils'

export interface AchievementPreviewRowProps {
  achievement: Achievement
}

/**
 * Homepage milestone row — date column, title with organization beneath,
 * category on the right. Reads as an editorial ledger, not a card grid.
 */
export function AchievementPreviewRow({ achievement }: AchievementPreviewRowProps) {
  const date = formatDate(achievement.date)
  const category = achievement.category ? ACHIEVEMENT_CATEGORY_LABELS[achievement.category] : null

  return (
    <li className="grid grid-cols-[4.75rem_1fr] gap-x-4 border-b border-border py-5 first:border-t sm:grid-cols-[7.5rem_1fr_auto] sm:gap-x-8 sm:py-6">
      <span className="text-label tabular pt-1 text-text-tertiary">{date ?? '—'}</span>
      <div className="min-w-0">
        <h3 className="font-display text-[1.125rem] font-bold leading-snug tracking-[-0.015em] text-text sm:text-h3">
          {achievement.title}
        </h3>
        {(achievement.organization || category) && (
          <p className="mt-1 text-body-sm text-text-secondary">
            {achievement.organization}
            {achievement.organization && category && <span className="sm:hidden"> · </span>}
            {category && <span className="sm:hidden">{category}</span>}
          </p>
        )}
      </div>
      {category && <span className="text-label hidden pt-1.5 text-text-tertiary sm:block">{category}</span>}
    </li>
  )
}
