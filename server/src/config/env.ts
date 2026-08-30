import 'dotenv/config'

/**
 * Centralized, validated environment access. Import `env` instead of
 * reading `process.env` directly elsewhere in the server.
 */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/portfolio',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
} as const

export const isProduction = env.nodeEnv === 'production'
