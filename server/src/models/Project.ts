import { Schema, model, type InferSchemaType } from 'mongoose'

export const PROJECT_STATUSES = ['draft', 'published', 'archived'] as const

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    gallery: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    githubUrl: { type: String },
    liveUrl: { type: String },
    featured: { type: Boolean, default: false },
    problem: { type: String },
    solution: { type: String },
    architecture: { type: String },
    features: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    outcome: { type: String },
    status: { type: String, enum: PROJECT_STATUSES, default: 'draft' },
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

projectSchema.index({ featured: 1 })
projectSchema.index({ status: 1 })

export type ProjectDocument = InferSchemaType<typeof projectSchema>
export const ProjectModel = model('Project', projectSchema)
