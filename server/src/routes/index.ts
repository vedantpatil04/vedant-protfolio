import { Router } from 'express'
import { authRouter } from './auth.routes'
import { projectRouter } from './project.routes'
import { certificateRouter } from './certificate.routes'
import { achievementRouter } from './achievement.routes'
import { skillRouter } from './skill.routes'
import { educationRouter } from './education.routes'
import { experienceRouter } from './experience.routes'
import { journeyRouter } from './journey.routes'
import { messageRouter } from './message.routes'
import { settingsRouter } from './settings.routes'
import { githubRouter } from './github.routes'
import mongoose from 'mongoose'
import { ok } from '../types/api'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }
  const dbStatus = dbStateMap[mongoose.connection.readyState] ?? 'disconnected'
  res.json(
    ok({
      status: 'ok',
      database: dbStatus,
      uptime: process.uptime(),
    }),
  )
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/projects', projectRouter)
apiRouter.use('/certificates', certificateRouter)
apiRouter.use('/achievements', achievementRouter)
apiRouter.use('/skills', skillRouter)
apiRouter.use('/education', educationRouter)
apiRouter.use('/experience', experienceRouter)
apiRouter.use('/journey', journeyRouter)
apiRouter.use('/messages', messageRouter)
apiRouter.use('/settings', settingsRouter)
apiRouter.use('/github', githubRouter)

// Admin-authenticated resources are protected per-route (see each
// router) rather than under a single /admin/* prefix, so GET stays
// public and only mutating verbs require a session — see README.
