import { asyncHandler } from '../utils/async-handler'
import { ok } from '../types/api'
import { getGitHubSummary } from '../services/github.service'

export const getGitHubActivity = asyncHandler(async (_req, res) => {
  const summary = await getGitHubSummary()
  res.json(ok(summary))
})

export const getGitHubProfile = asyncHandler(async (_req, res) => {
  const summary = await getGitHubSummary()
  res.json(ok(summary.profile))
})

export const getGitHubRepositories = asyncHandler(async (_req, res) => {
  const summary = await getGitHubSummary()
  res.json(ok(summary.topRepos))
})

export const getGitHubRecentActivity = asyncHandler(async (_req, res) => {
  const summary = await getGitHubSummary()
  res.json(ok(summary.recentActivity))
})
