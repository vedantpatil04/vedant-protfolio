import { apiClient } from './api'
import type { Achievement } from '@/types'

export const achievementService = {
  list: (params?: { featured?: boolean }) =>
    apiClient.get<Achievement[]>(`/achievements${params?.featured ? '?featured=true' : ''}`),

  // Admin
  listAll: () => apiClient.get<Achievement[]>('/achievements/admin/all'),
  create: (input: Partial<Achievement>) => apiClient.post<Achievement>('/achievements', input),
  update: (id: string, input: Partial<Achievement>) => apiClient.put<Achievement>(`/achievements/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/achievements/${id}`),
}
