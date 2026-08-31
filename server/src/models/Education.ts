import { Schema, model, type InferSchemaType } from 'mongoose'

const educationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true },
    field: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    grade: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

educationSchema.index({ order: 1 })

export type EducationDocument = InferSchemaType<typeof educationSchema>
export const EducationModel = model('Education', educationSchema)
