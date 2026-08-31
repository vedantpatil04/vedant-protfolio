import { Schema, model, type InferSchemaType } from 'mongoose'

export const MESSAGE_STATUSES = ['unread', 'read', 'archived'] as const

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: MESSAGE_STATUSES, default: 'unread' },
  },
  { timestamps: true },
)

messageSchema.index({ status: 1 })
messageSchema.index({ createdAt: -1 })

export type MessageDocument = InferSchemaType<typeof messageSchema>
export const MessageModel = model('Message', messageSchema)
