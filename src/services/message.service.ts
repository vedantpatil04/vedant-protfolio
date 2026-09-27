import { apiClient } from './api'
import type { Message, MessageStatus } from '@/types'

export interface ContactMessageInput {
  name: string
  email: string
  subject?: string
  message: string
  /** Honeypot — always left empty by real visitors; see ContactSection. */
  website?: string
}

export const messageService = {
  /** Public — used by the contact form. */
  send: (input: ContactMessageInput) => apiClient.post<{ id: string }>('/messages', input),

  // Admin — inbox management.
  list: () => apiClient.get<Message[]>('/messages'),
  updateStatus: (id: string, status: MessageStatus) =>
    apiClient.patch<Message>(`/messages/${id}`, { status }),
  remove: (id: string) => apiClient.delete<null>(`/messages/${id}`),
}
