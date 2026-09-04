import { Router } from 'express'
import { listJourney, createJourney, updateJourney, deleteJourney } from '../controllers/journey.controller'
import { authenticate } from '../middleware/authenticate'

export const journeyRouter = Router()

journeyRouter.get('/', listJourney)
journeyRouter.post('/', authenticate, createJourney)
journeyRouter.put('/:id', authenticate, updateJourney)
journeyRouter.patch('/:id', authenticate, updateJourney)
journeyRouter.delete('/:id', authenticate, deleteJourney)
