import { Schema, model, type InferSchemaType } from 'mongoose'

const experienceSchema = new Schema(
  {
    organization: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
    technologies: { type: [String], default: [] },
    url: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

experienceSchema.index({ order: 1 })

export type ExperienceDocument = InferSchemaType<typeof experienceSchema>
export const ExperienceModel = model('Experience', experienceSchema)
