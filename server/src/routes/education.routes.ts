import { Router } from 'express'
import { listEducation, createEducation, updateEducation, deleteEducation } from '../controllers/education.controller'
import { authenticate } from '../middleware/authenticate'

export const educationRouter = Router()

educationRouter.get('/', listEducation)
educationRouter.post('/', authenticate, createEducation)
educationRouter.put('/:id', authenticate, updateEducation)
educationRouter.patch('/:id', authenticate, updateEducation)
educationRouter.delete('/:id', authenticate, deleteEducation)
