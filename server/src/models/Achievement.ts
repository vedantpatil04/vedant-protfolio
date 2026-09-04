import { Schema, model, type InferSchemaType } from 'mongoose'

export const ACHIEVEMENT_CATEGORIES = ['hackathon', 'competition', 'award', 'publication', 'other'] as const

const achievementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ACHIEVEMENT_CATEGORIES, default: 'other' },
    date: { type: Date, required: true },
    organization: { type: String },
    imageUrl: { type: String },
    url: { type: String },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
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

achievementSchema.index({ date: -1 })

export type AchievementDocument = InferSchemaType<typeof achievementSchema>
export const AchievementModel = model('Achievement', achievementSchema)
