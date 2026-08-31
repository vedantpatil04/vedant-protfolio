import { apiClient } from './api'

export interface ContactMessageInput {
  name: string
  email: string
  subject?: string
  message: string
}

export const messageService = {
  /** Public — used by the contact form. */
  send: (input: ContactMessageInput) => apiClient.post<{ id: string }>('/messages', input),
}
