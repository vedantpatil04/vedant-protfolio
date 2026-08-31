import { apiClient } from './api'
import type { Skill } from '@/types'

export const skillService = {
  list: () => apiClient.get<Skill[]>('/skills'),

  // Admin
  create: (input: Partial<Skill>) => apiClient.post<Skill>('/skills', input),
  update: (id: string, input: Partial<Skill>) => apiClient.put<Skill>(`/skills/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/skills/${id}`),
}
