import { Schema, model, type InferSchemaType } from 'mongoose'

export const SKILL_CATEGORIES = ['frontend', 'backend', 'database', 'ai', 'devtools', 'language', 'other'] as const
export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: SKILL_CATEGORIES, required: true },
    level: { type: String, enum: SKILL_LEVELS },
    icon: { type: String },
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

skillSchema.index({ category: 1, order: 1 })

export type SkillDocument = InferSchemaType<typeof skillSchema>
export const SkillModel = model('Skill', skillSchema)
