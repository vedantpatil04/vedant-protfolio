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

experienceSchema.index({ order: 1 })

export type ExperienceDocument = InferSchemaType<typeof experienceSchema>
export const ExperienceModel = model('Experience', experienceSchema)
