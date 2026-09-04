/**
 * Mirrors the backend Journey model (server/src/models/Journey.ts) —
 * kept in sync by hand, same convention as the other content types.
 */
export const JOURNEY_CATEGORIES = ['education', 'milestone', 'project', 'focus'] as const
export type JourneyCategory = (typeof JOURNEY_CATEGORIES)[number]

export interface JourneyEntry {
  id: string
  title: string
  description: string
  date: string
  category?: JourneyCategory
  organization?: string
  /** True for an ongoing/current entry (surfaced separately as "Current Focus"). */
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}
