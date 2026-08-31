import { apiClient } from './api'
import type { Education } from '@/types'

export const educationService = {
  list: () => apiClient.get<Education[]>('/education'),

  // Admin
  create: (input: Partial<Education>) => apiClient.post<Education>('/education', input),
  update: (id: string, input: Partial<Education>) => apiClient.put<Education>(`/education/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/education/${id}`),
}
