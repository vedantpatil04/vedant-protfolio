import { Schema, model, type InferSchemaType } from 'mongoose'

export const SKILL_CATEGORIES = ['frontend', 'backend', 'database', 'devtools', 'language', 'other'] as const
export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: SKILL_CATEGORIES, required: true },
    level: { type: String, enum: SKILL_LEVELS },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

skillSchema.index({ category: 1, order: 1 })

export type SkillDocument = InferSchemaType<typeof skillSchema>
export const SkillModel = model('Skill', skillSchema)
