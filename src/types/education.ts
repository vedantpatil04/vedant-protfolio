/**
 * Mirrors the backend Education model (server/src/models/Education.ts) —
 * kept in sync by hand, same convention as Skill/Project.
 */
export interface Education {
  id: string
  institution: string
  degree: string
  field?: string
  startDate: string
  endDate?: string
  grade?: string
  description?: string
  order: number
  createdAt: string
  updatedAt: string
}
