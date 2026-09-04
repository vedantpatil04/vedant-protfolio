import { Schema, model, type InferSchemaType } from 'mongoose'

const certificateSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true },
    category: { type: String },
    issueDate: { type: Date, required: true },
    description: { type: String },
    imageUrl: { type: String },
    pdfUrl: { type: String },
    credentialId: { type: String },
    verificationUrl: { type: String },
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

certificateSchema.index({ issueDate: -1 })

export type CertificateDocument = InferSchemaType<typeof certificateSchema>
export const CertificateModel = model('Certificate', certificateSchema)
