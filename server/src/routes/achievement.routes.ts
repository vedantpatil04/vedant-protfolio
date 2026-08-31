import { Router } from 'express'
import {
  listAchievements,
  listAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievement.controller'
import { authenticate } from '../middleware/authenticate'

export const achievementRouter = Router()

achievementRouter.get('/', listAchievements)
achievementRouter.get('/admin/all', authenticate, listAllAchievements)
achievementRouter.post('/', authenticate, createAchievement)
achievementRouter.put('/:id', authenticate, updateAchievement)
achievementRouter.patch('/:id', authenticate, updateAchievement)
achievementRouter.delete('/:id', authenticate, deleteAchievement)
