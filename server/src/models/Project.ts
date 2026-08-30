import { Schema, model, type InferSchemaType } from 'mongoose'

/**
 * Mirrors the client-side `Project` type in src/types/project.ts.
 * Reference implementation for how future models (Certificate,
 * Achievement, Skill, Education, Experience) should be structured —
 * not populated with data in Phase 1.
 */
const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    technologies: { type: [String], default: [] },
    thumbnail: { type: String },
    images: { type: [String], default: [] },
    githubUrl: { type: String },
    liveUrl: { type: String },
    featured: { type: Boolean, default: false },
    role: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true },
)

export type ProjectDocument = InferSchemaType<typeof projectSchema>
export const ProjectModel = model('Project', projectSchema)
