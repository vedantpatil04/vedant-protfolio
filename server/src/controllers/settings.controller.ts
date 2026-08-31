import type { Request, Response } from 'express'
import { SiteSettingsModel } from '../models/SiteSettings'
import { asyncHandler } from '../utils/async-handler'
import { ok } from '../types/api'

/**
 * SiteSettings is a singleton — these handlers always operate on the
 * one document, creating it on first read/write rather than requiring
 * a separate provisioning step.
 */
export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = (await SiteSettingsModel.findOne()) ?? (await SiteSettingsModel.create({}))
  res.json(ok(settings))
})

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SiteSettingsModel.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  })
  res.json(ok(settings, 'Updated'))
})
