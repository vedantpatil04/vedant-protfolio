import { Router } from 'express'
import {
  getGitHubActivity,
  getGitHubProfile,
  getGitHubRepositories,
  getGitHubRecentActivity,
} from '../controllers/github.controller'

export const githubRouter = Router()

// Public — read-only, server-cached, nothing to admin-gate.
githubRouter.get('/summary', getGitHubActivity)
githubRouter.get('/profile', getGitHubProfile)
githubRouter.get('/repositories', getGitHubRepositories)
githubRouter.get('/activity', getGitHubRecentActivity)
