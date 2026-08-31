import { Router } from 'express'
import { getSettings, updateSettings } from '../controllers/settings.controller'
import { authenticate } from '../middleware/authenticate'

export const settingsRouter = Router()

settingsRouter.get('/', getSettings)
settingsRouter.put('/', authenticate, updateSettings)
