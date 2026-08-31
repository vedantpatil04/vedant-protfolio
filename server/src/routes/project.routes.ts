import { Router } from 'express'
import {
  listProjects,
  getProjectBySlug,
  listAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller'
import { authenticate } from '../middleware/authenticate'

export const projectRouter = Router()

// Public
projectRouter.get('/', listProjects)
projectRouter.get('/:slug', getProjectBySlug)

// Admin
projectRouter.get('/admin/all', authenticate, listAllProjects)
projectRouter.post('/', authenticate, createProject)
projectRouter.put('/:id', authenticate, updateProject)
projectRouter.patch('/:id', authenticate, updateProject)
projectRouter.delete('/:id', authenticate, deleteProject)
