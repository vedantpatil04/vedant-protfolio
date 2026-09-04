import { apiClient } from './api'
import type { GitHubSummary } from '@/types'

export const githubService = {
  getSummary: () => apiClient.get<GitHubSummary>('/github/summary'),
}
