import { ProjectModel } from '../models/Project'
import * as crud from '../utils/crud-factory'

const publicFilter = { status: 'published' }

export const listProjects = crud.publicList(ProjectModel, { publicFilter })
export const getProjectBySlug = crud.publicGetBySlug(ProjectModel, { publicFilter })

export const listAllProjects = crud.adminList(ProjectModel)
export const createProject = crud.adminCreate(ProjectModel)
export const updateProject = crud.adminUpdate(ProjectModel)
export const deleteProject = crud.adminDelete(ProjectModel)
