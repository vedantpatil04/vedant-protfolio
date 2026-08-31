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

app.use(helmet())
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(requestLogger)

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  try {
    await connectDatabase()
  } catch {
    console.error('[server] starting without a database connection — data routes will fail until MongoDB is reachable')
  }

  const server = app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port} (${env.nodeEnv})`)
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
