import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { connectDatabase, disconnectDatabase } from './config/database'
import { apiRouter } from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import { requestLogger } from './middleware/request-logger'

const app = express()

// Trust reverse proxy (e.g. Render) for secure cookies and https protocol detection
app.set('trust proxy', 1)

// Normalize allowed origins: trim whitespace and trailing slashes; support comma-separated origins
const allowedOrigins = env.clientUrl
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean)

app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      const normalizedOrigin = origin.trim().replace(/\/+$/, '')
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true)
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
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

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  const PORT = Number(process.env.PORT) || env.port || 4000
  const HOST = '0.0.0.0'

  // Bind the HTTP server immediately on 0.0.0.0 so Render detects the open port without delay
  const server = app.listen(PORT, HOST, () => {
    console.log(`[server] listening on http://${HOST}:${PORT} (${env.nodeEnv})`)
    console.log(`[server] port ${PORT} bound successfully on ${HOST}`)
  })

  // Connect to database in the background without blocking port binding or health checks
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
