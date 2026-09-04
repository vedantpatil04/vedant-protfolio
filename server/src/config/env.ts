import 'dotenv/config'
import { z } from 'zod'

/**
 * Validates process.env once at startup so the server fails fast and
 * loudly if required configuration is missing, instead of failing
 * confusingly later (e.g. a cryptic Mongoose connection error).
 *
 * Admin seed variables (ADMIN_*) are intentionally NOT required here —
 * they're only read by the seed script (scripts/seed-admin.ts), which
 * validates them itself, so the server can start without them.
 */
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL is required'),

  // GitHub integration (Phase 7). Public profile/repo/activity data works
  // with just a username via the REST API. GITHUB_TOKEN is optional — when
  // set, the service additionally uses the GraphQL API for the real
  // contribution calendar and pinned repos (both unavailable unauthenticated).
  GITHUB_USERNAME: z.string().min(1).default('vedantpatil04'),
  GITHUB_TOKEN: z.string().optional(),
})

function loadEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('[env] invalid or missing environment variables:')
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    }
    process.exit(1)
  }

  return parsed.data
}

const parsedEnv = loadEnv()

export const env = {
  port: parsedEnv.PORT,
  nodeEnv: parsedEnv.NODE_ENV,
  mongodbUri: parsedEnv.MONGODB_URI,
  jwtSecret: parsedEnv.JWT_SECRET,
  jwtExpiresIn: parsedEnv.JWT_EXPIRES_IN,
  clientUrl: parsedEnv.CLIENT_URL,
  githubUsername: parsedEnv.GITHUB_USERNAME,
  githubToken: parsedEnv.GITHUB_TOKEN,
} as const

export const isProduction = env.nodeEnv === 'production'
