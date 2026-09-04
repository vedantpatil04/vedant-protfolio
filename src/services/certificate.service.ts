import { apiClient } from './api'
import type { Certificate } from '@/types'

export const certificateService = {
  list: (params?: { featured?: boolean }) =>
    apiClient.get<Certificate[]>(`/certificates${params?.featured ? '?featured=true' : ''}`),
  getById: (id: string) => apiClient.get<Certificate>(`/certificates/${id}`),

  // Admin
  listAll: () => apiClient.get<Certificate[]>('/certificates/admin/all'),
  create: (input: Partial<Certificate>) => apiClient.post<Certificate>('/certificates', input),
  update: (id: string, input: Partial<Certificate>) => apiClient.put<Certificate>(`/certificates/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/certificates/${id}`),
}
