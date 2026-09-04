import { apiClient } from './api'
import type { JourneyEntry } from '@/types'

export const journeyService = {
  list: (params?: { featured?: boolean }) =>
    apiClient.get<JourneyEntry[]>(`/journey${params?.featured ? '?featured=true' : ''}`),

  // Admin
  create: (input: Partial<JourneyEntry>) => apiClient.post<JourneyEntry>('/journey', input),
  update: (id: string, input: Partial<JourneyEntry>) => apiClient.put<JourneyEntry>(`/journey/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/journey/${id}`),
}
