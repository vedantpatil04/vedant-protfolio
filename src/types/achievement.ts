/**
 * Mirrors the backend Achievement model (server/src/models/Achievement.ts) —
 * kept in sync by hand, same convention as Project/Certificate.
 */
export const ACHIEVEMENT_CATEGORIES = ['hackathon', 'competition', 'award', 'publication', 'other'] as const
export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number]

export interface Achievement {
  id: string
  title: string
  description: string
  category?: AchievementCategory
  date: string
  organization?: string
  imageUrl?: string
  url?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}
