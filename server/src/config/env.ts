import path from 'path'
import dotenv from 'dotenv'
import { z } from 'zod'

// Load .env from current directory first, then fallback to server/.env if invoked from repo root
dotenv.config()
try {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') })
} catch {
  // Ignore if path not found
}

/**
 * Validates process.env at startup. Safe fallbacks are provided so missing
 * optional/initial configuration never crashes the process before the HTTP
 * server can bind to 0.0.0.0 (preventing Render "No open ports detected").
 */
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/portfolio'),
  JWT_SECRET: z.string().min(16).default('development-jwt-secret-min-16-chars-fallback'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:5173'),

  // GitHub integration (Phase 7). Public profile/repo/activity data works
  // with just a username via the REST API. GITHUB_TOKEN is optional.
  GITHUB_USERNAME: z.string().min(1).default('vedantpatil04'),
  GITHUB_TOKEN: z.string().optional(),
})

function loadEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('[env] invalid environment variables:')
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    }
    // Only exit if truly unparseable data types exist; otherwise continue with defaults
  }

  const data = parsed.success ? parsed.data : envSchema.parse({})

  if (data.NODE_ENV === 'production') {
    if (data.MONGODB_URI === 'mongodb://localhost:27017/portfolio') {
      console.warn('[env] WARNING: MONGODB_URI not set in production. Database features will fail until MONGODB_URI is provided in Render.')
    }
    if (data.JWT_SECRET.startsWith('development-')) {
      console.warn('[env] WARNING: JWT_SECRET not set in production. Admin auth sessions will not be secure until JWT_SECRET is provided in Render.')
    }
  }

  return data
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
