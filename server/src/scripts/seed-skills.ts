import 'dotenv/config'
import mongoose from 'mongoose'
import { env } from '../config/env'
import { SkillModel } from '../models/Skill'

/**
 * Seeds a deliberately conservative skill list — Phase 6's spec warns
 * against dumping an entire resume's technology list without project
 * evidence. Every entry here is directly verifiable either from this
 * portfolio's own package.json (real, in-repo proof) or from GreenGuard
 * AI's confirmed stack. Broader resume items (Java, Python, C, C#, PHP,
 * R, Spring, Hibernate, Django, Flask, MySQL, SQL, Machine Learning,
 * Data Analysis, NetBeans) are intentionally left out — edit this file
 * and re-run to add any of them once there's a project to point to.
 * Upserts by name, so safe to run repeatedly. Run with: npm run seed:skills
 */

const RECORDS = [
  // Language
  { name: 'TypeScript', category: 'language', order: 0 },
  { name: 'JavaScript', category: 'language', order: 1 },
  // Frontend
  { name: 'React', category: 'frontend', order: 0 },
  { name: 'Tailwind CSS', category: 'frontend', order: 1 },
  { name: 'Vite', category: 'frontend', order: 2 },
  { name: 'Framer Motion', category: 'frontend', order: 3 },
  // Backend
  { name: 'Node.js', category: 'backend', order: 0 },
  { name: 'Express', category: 'backend', order: 1 },
  // Database
  { name: 'MongoDB', category: 'database', order: 0 },
  // AI
  { name: 'Gemini AI', category: 'ai', order: 0 },
  // Devtools
  { name: 'Git', category: 'devtools', order: 0 },
] as const

async function main() {
  await mongoose.connect(env.mongodbUri)

  for (const record of RECORDS) {
    const result = await SkillModel.findOneAndUpdate(
      { name: record.name },
      { $set: record },
      { upsert: true, new: true },
    )
    console.log(`[seed:skills] upserted "${result.name}" (${result.category})`)
  }

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error('[seed:skills] failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
