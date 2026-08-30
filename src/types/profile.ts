export interface Profile {
  name: string
  title: string
  tagline?: string
  location?: string
  github?: string
  linkedin?: string
  email?: string
  resume?: string
  availability?: 'open-to-work' | 'open-to-freelance' | 'not-available'
}
