import { apiClient } from './api'

export interface SiteSettings {
  name?: string
  title?: string
  bio?: string
  location?: string
  email?: string
  githubUrl?: string
  linkedinUrl?: string
  resumeUrl?: string
  profileImage?: string
  availability?: 'open-to-work' | 'open-to-freelance' | 'not-available'
}

export const settingsService = {
  get: () => apiClient.get<SiteSettings>('/settings'),

  // Admin
  update: (input: Partial<SiteSettings>) => apiClient.put<SiteSettings>('/settings', input),
}
