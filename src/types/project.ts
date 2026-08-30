export interface Project {
  id: string
  slug: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  thumbnail?: string
  images?: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  role?: string
  startDate?: string
  endDate?: string
  highlights?: string[]
}
