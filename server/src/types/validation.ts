import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const messageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(254),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, 'Message is too short').max(5000),
  // Honeypot — a real visitor never sees or fills this field (hidden off-screen
  // in the form). Deliberately permissive here: failing schema validation would
  // return a 400 that tips a bot off to the trap. The controller checks this
  // value itself and silently no-ops instead of persisting/emailing/erroring.
  website: z.string().trim().max(500).optional().default(''),
})

export type MessageInput = z.infer<typeof messageSchema>
