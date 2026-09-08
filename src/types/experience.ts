/**
 * Mirrors the backend Experience model (server/src/models/Experience.ts) —
 * kept in sync by hand, same convention as the other content types.
 */
export interface Experience {
  id: string
  organization: string
  role: string
  startDate: string
  endDate?: string
  description?: string
  technologies: string[]
  url?: string
  order: number
  createdAt: string
  updatedAt: string
}
