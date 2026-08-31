import { Schema, model, type InferSchemaType } from 'mongoose'

/**
 * Singleton document — exactly one SiteSettings row should ever exist.
 * Enforced at the service/controller level (findOneAndUpdate with
 * upsert) rather than a unique index on a constant, to keep the schema
 * itself simple.
 */
const siteSettingsSchema = new Schema(
  {
    name: { type: String },
    title: { type: String },
    bio: { type: String },
    location: { type: String },
    email: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    resumeUrl: { type: String },
    profileImage: { type: String },
    availability: {
      type: String,
      enum: ['open-to-work', 'open-to-freelance', 'not-available'],
    },
  },
  { timestamps: true },
)

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>
export const SiteSettingsModel = model('SiteSettings', siteSettingsSchema)
