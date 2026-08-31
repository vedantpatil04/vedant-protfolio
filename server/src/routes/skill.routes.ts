import { Router } from 'express'
import { listSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skill.controller'
import { authenticate } from '../middleware/authenticate'

export const skillRouter = Router()

skillRouter.get('/', listSkills)
skillRouter.post('/', authenticate, createSkill)
skillRouter.put('/:id', authenticate, updateSkill)
skillRouter.patch('/:id', authenticate, updateSkill)
skillRouter.delete('/:id', authenticate, deleteSkill)
