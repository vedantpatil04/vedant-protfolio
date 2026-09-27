/**
 * Mirrors the backend Message model (server/src/models/Message.ts) — kept
 * in sync by hand, same convention as Project/Certificate/Achievement.
 */
export const MESSAGE_STATUSES = ['unread', 'read', 'archived'] as const
export type MessageStatus = (typeof MESSAGE_STATUSES)[number]

export interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: MessageStatus
  createdAt: string
  updatedAt: string
}
