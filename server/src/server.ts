import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { connectDatabase, disconnectDatabase } from './config/database'
import { apiRouter } from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import { requestLogger } from './middleware/request-logger'

console.log('[startup] 1/5: beginning portfolio-server initialization...')

const app = express()

// Trust reverse proxy (e.g. Render) for secure cookies and https protocol detection
app.set('trust proxy', 1)

// Normalize allowed origins: trim whitespace and trailing slashes; support comma-separated origins
const rawOrigins = env.clientUrl
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean)

// Ensure production Vercel domain, localhost, and local loopback are accepted for development and testing
const allowedOrigins = Array.from(
  new Set([
    ...rawOrigins,
    'https://vedant-protfolio1.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ]),
)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, health checks)
      if (!origin) return callback(null, true)
      const normalizedOrigin = origin.trim().replace(/\/+$/, '')

      // Match explicit allowed origins
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true)
      }

      // Match *.vercel.app preview deployments and vercel domains
      if (
        /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true)
      }

      // Disallow without throwing a 500 error to the client
      console.warn(`[cors] Rejected origin: ${origin}`)
      return callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(requestLogger)

// Root and /health endpoints for platform health-check probes (e.g. Render)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})
app.get('/', (_req, res) => {
  res.json({ status: 'ok', name: 'portfolio-server', health: '/api/health' })
})

app.use('/api', apiRouter)

// Register top-level process crash handlers to prevent silent exits
process.on('uncaughtException', (err) => {
  console.error('[fatal] uncaught exception:', err instanceof Error ? err.stack || err.message : err)
})
process.on('unhandledRejection', (reason) => {
  console.error('[fatal] unhandled rejection:', reason instanceof Error ? reason.stack || reason.message : reason)
})

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  const PORT = Number(process.env.PORT) || env.port || 4000
  const HOST = '0.0.0.0'

  console.log(`[startup] 3/5: server listen attempt on ${HOST}:${PORT}...`)

  // Bind the HTTP server immediately on 0.0.0.0 so Render detects the open port without delay
  const server = app.listen(PORT, HOST, () => {
    console.log(`[server] listening on http://${HOST}:${PORT} (${env.nodeEnv})`)
    console.log(`[startup] 4/5: actual bound port: ${PORT} on ${HOST} — server healthy and listening`)
  })

  server.on('error', (err: NodeJS.ErrnoException) => {
    console.error(`[startup] server listen error on ${HOST}:${PORT}:`, err.message)
    process.exit(1)
  })

  // Connect to database in the background without blocking port binding or health checks
  console.log('[startup] 5/5: background database connection attempt initiated...')
  connectDatabase().catch((err) => {
    console.error(
      '[server] initial database connection failed — data routes will fail until MongoDB is reachable:',
      err instanceof Error ? err.message : err,
    )
  })

  const shutdown = async (signal: string) => {
    console.log(`[server] received ${signal}, shutting down gracefully`)
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

start()

