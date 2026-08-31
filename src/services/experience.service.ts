import { apiClient } from './api'
import type { Experience } from '@/types'

export const experienceService = {
  list: () => apiClient.get<Experience[]>('/experience'),

  // Admin
  create: (input: Partial<Experience>) => apiClient.post<Experience>('/experience', input),
  update: (id: string, input: Partial<Experience>) => apiClient.put<Experience>(`/experience/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/experience/${id}`),
}
