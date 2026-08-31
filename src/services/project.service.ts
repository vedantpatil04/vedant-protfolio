import { apiClient } from './api'
import type { Project } from '@/types'

export const projectService = {
  list: (params?: { featured?: boolean }) =>
    apiClient.get<Project[]>(`/projects${params?.featured ? '?featured=true' : ''}`),
  getBySlug: (slug: string) => apiClient.get<Project>(`/projects/${slug}`),

  // Admin
  listAll: () => apiClient.get<Project[]>('/projects/admin/all'),
  create: (input: Partial<Project>) => apiClient.post<Project>('/projects', input),
  update: (id: string, input: Partial<Project>) => apiClient.put<Project>(`/projects/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/projects/${id}`),
}
