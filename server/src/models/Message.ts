import { Schema, model, type InferSchemaType } from 'mongoose'

export const MESSAGE_STATUSES = ['unread', 'read', 'archived'] as const

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: MESSAGE_STATUSES, default: 'unread' },
  },
  {
    timestamps: true,
    // Matches every other content model (Project, Certificate, Achievement, ...)
    // so the admin CMS and its shared crud-factory/DataTable get a plain `id`
    // instead of having to know about Mongo's `_id` for this one resource.
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id)
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

messageSchema.index({ status: 1 })
messageSchema.index({ createdAt: -1 })

export type MessageDocument = InferSchemaType<typeof messageSchema>
export const MessageModel = model('Message', messageSchema)
