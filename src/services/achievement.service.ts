import { apiClient } from './api'
import type { Achievement } from '@/types'

export const achievementService = {
  list: () => apiClient.get<Achievement[]>('/achievements'),

  // Admin
  create: (input: Partial<Achievement>) => apiClient.post<Achievement>('/achievements', input),
  update: (id: string, input: Partial<Achievement>) => apiClient.put<Achievement>(`/achievements/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/achievements/${id}`),
}
