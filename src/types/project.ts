/**
 * Mirrors the backend Project model (server/src/models/Project.ts) —
 * the frontend and API have no shared-types package, so this is kept
 * in sync by hand. Fields are exactly what the API returns; nothing
 * here should be invented on the client.
 */
export const PROJECT_STATUSES = ['draft', 'published', 'archived'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  thumbnail?: string
  gallery: string[]
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  problem?: string
  solution?: string
  architecture?: string
  features: string[]
  challenges: string[]
  outcome?: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}
