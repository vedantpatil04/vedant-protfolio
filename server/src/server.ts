import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { apiRouter } from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import { requestLogger } from './middleware/request-logger'

const app = express()

app.use(cors({ origin: env.clientOrigin }))
app.use(express.json())
app.use(requestLogger)

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`[server] listening on http://localhost:${env.port}`)
})
