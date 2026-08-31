import { Router } from 'express'
import { authRouter } from './auth.routes'
import { projectRouter } from './project.routes'
import { certificateRouter } from './certificate.routes'
import { achievementRouter } from './achievement.routes'
import { skillRouter } from './skill.routes'
import { educationRouter } from './education.routes'
import { experienceRouter } from './experience.routes'
import { messageRouter } from './message.routes'
import { settingsRouter } from './settings.routes'
import { ok } from '../types/api'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.json(ok({ status: 'ok' }))
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/projects', projectRouter)
apiRouter.use('/certificates', certificateRouter)
apiRouter.use('/achievements', achievementRouter)
apiRouter.use('/skills', skillRouter)
apiRouter.use('/education', educationRouter)
apiRouter.use('/experience', experienceRouter)
apiRouter.use('/messages', messageRouter)
apiRouter.use('/settings', settingsRouter)

// Admin-authenticated resources are protected per-route (see each
// router) rather than under a single /admin/* prefix, so GET stays
// public and only mutating verbs require a session — see README.
