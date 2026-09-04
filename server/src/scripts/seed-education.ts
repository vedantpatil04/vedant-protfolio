import 'dotenv/config'
import mongoose from 'mongoose'
import { env } from '../config/env'
import { EducationModel } from '../models/Education'

/**
 * Seeds the three real, confirmed education records (Phase 6 spec —
 * do not change these values unless a newer confirmed source exists).
 * Upserts by institution+degree, so it's safe to run repeatedly: it
 * updates values in place rather than creating duplicates. Run with:
 * npm run seed:education
 */

const RECORDS = [
  {
    institution: 'Govindram Seksaria Science College, Belagavi',
    degree: 'Bachelor of Computer Applications (BCA)',
    startDate: new Date('2024-01-01'),
    grade: '7.95 / 10 CGPA',
    order: 0,
  },
  {
    institution: 'Karnataka (PUC)',
    degree: 'Class XII',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2024-04-01'),
    grade: '77.83%',
    order: 1,
  },
  {
    institution: 'Karnataka (SSLC)',
    degree: 'Class X',
    startDate: new Date('2020-06-01'),
    endDate: new Date('2021-04-01'),
    grade: '88.48%',
    order: 2,
  },
]

async function main() {
  await mongoose.connect(env.mongodbUri)

  for (const record of RECORDS) {
    const result = await EducationModel.findOneAndUpdate(
      { institution: record.institution, degree: record.degree },
      { $set: record },
      { upsert: true, new: true },
    )
    console.log(`[seed:education] upserted "${result.degree}"`)
  }

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error('[seed:education] failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
