import { Schema, model, type InferSchemaType } from 'mongoose'

export const JOURNEY_CATEGORIES = ['education', 'milestone', 'project', 'focus'] as const

const journeySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, enum: JOURNEY_CATEGORIES },
    organization: { type: String },
    // Marks an entry as current/ongoing (e.g. "DSA + Full-Stack Development")
    // rather than a completed milestone — surfaced separately as "Current Focus".
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
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

journeySchema.index({ date: 1 })

export type JourneyDocument = InferSchemaType<typeof journeySchema>
export const JourneyModel = model('Journey', journeySchema)
