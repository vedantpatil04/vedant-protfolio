import { Router } from 'express'
import {
  listExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experience.controller'
import { authenticate } from '../middleware/authenticate'

export const experienceRouter = Router()

experienceRouter.get('/', listExperience)
experienceRouter.post('/', authenticate, createExperience)
experienceRouter.put('/:id', authenticate, updateExperience)
experienceRouter.patch('/:id', authenticate, updateExperience)
experienceRouter.delete('/:id', authenticate, deleteExperience)
