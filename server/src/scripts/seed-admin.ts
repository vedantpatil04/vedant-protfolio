import 'dotenv/config'
import { z } from 'zod'
import mongoose from 'mongoose'
import { env } from '../config/env'
import { AdminModel } from '../models/Admin'
import { hashPassword } from '../utils/password'

/**
 * Creates the first admin account from environment variables. Safe to
 * run repeatedly — it's a no-op (and never overwrites) if an admin
 * with that email already exists. Run with: npm run seed:admin
 */

const seedEnvSchema = z.object({
  ADMIN_NAME: z.string().min(1, 'ADMIN_NAME is required'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters'),
})

async function main() {
  const parsed = seedEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error('[seed:admin] missing or invalid environment variables:')
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    }
    process.exit(1)
  }

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = parsed.data

  await mongoose.connect(env.mongodbUri)

  const existing = await AdminModel.findOne({ email: ADMIN_EMAIL.toLowerCase() })
  if (existing) {
    console.log(`[seed:admin] an admin with email ${ADMIN_EMAIL} already exists — nothing to do`)
    await mongoose.disconnect()
    return
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD)

  await AdminModel.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: 'admin',
    isActive: true,
  })

  // Deliberately never logs the password, even in dev.
  console.log(`[seed:admin] created admin account for ${ADMIN_EMAIL}`)

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error('[seed:admin] failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
