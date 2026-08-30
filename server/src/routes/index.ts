import { Router } from 'express'
import { projectRouter } from './project.routes'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

apiRouter.use('/projects', projectRouter)

// Additional resources (certificates, achievements, skills, education,
// experience, contact submissions, auth) follow the same
// router → controller → model pattern in later phases.
