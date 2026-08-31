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
  { timestamps: true },
)

certificateSchema.index({ issueDate: -1 })

export type CertificateDocument = InferSchemaType<typeof certificateSchema>
export const CertificateModel = model('Certificate', certificateSchema)
