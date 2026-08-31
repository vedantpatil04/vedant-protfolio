import { Schema, model, type InferSchemaType } from 'mongoose'

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
)

export type AdminDocument = InferSchemaType<typeof adminSchema>
export const AdminModel = model('Admin', adminSchema)

/** Fields safe to ever send to a client — never includes passwordHash. */
export interface SafeAdmin {
  id: string
  name: string
  email: string
  role: 'admin'
  isActive: boolean
  lastLoginAt?: Date
}

export function toSafeAdmin(admin: {
  _id: unknown
  name: string
  email: string
  role: 'admin'
  isActive: boolean
  lastLoginAt?: Date | null
}): SafeAdmin {
  return {
    id: String(admin._id),
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    lastLoginAt: admin.lastLoginAt ?? undefined,
  }
}
