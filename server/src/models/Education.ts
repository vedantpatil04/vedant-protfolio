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

educationSchema.index({ order: 1 })

export type EducationDocument = InferSchemaType<typeof educationSchema>
export const EducationModel = model('Education', educationSchema)
