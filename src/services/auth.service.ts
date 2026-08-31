import { apiClient } from './api'
import type { SafeAdmin } from '@/types'

export interface LoginInput {
  email: string
  password: string
}

export const authService = {
  login: (input: LoginInput) => apiClient.post<SafeAdmin>('/auth/login', input),
  logout: () => apiClient.post<null>('/auth/logout'),
  me: () => apiClient.get<SafeAdmin>('/auth/me'),
}
