import type { Achievement } from '@/types'
import { formatDate } from '@/lib/utils'

export interface AchievementPreviewRowProps {
  achievement: Achievement
}

/** Compact single-line row for the homepage Achievements preview — "2026 · Hackathon". */
export function AchievementPreviewRow({ achievement }: AchievementPreviewRowProps) {
  const year = formatDate(achievement.date, { year: 'numeric' })

  return (
    <div className="flex items-baseline gap-4 border-b border-border py-4 first:pt-0 last:border-b-0">
      {year && <span className="font-mono text-caption text-text-tertiary">{year}</span>}
      <span className="text-body font-medium text-text">{achievement.title}</span>
    </div>
  )
}
