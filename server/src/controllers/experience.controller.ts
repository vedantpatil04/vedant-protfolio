import { ExperienceModel } from '../models/Experience'
import * as crud from '../utils/crud-factory'

export const listExperience = crud.publicList(ExperienceModel, { defaultSort: { order: 1 } })

export const createExperience = crud.adminCreate(ExperienceModel)
export const updateExperience = crud.adminUpdate(ExperienceModel)
export const deleteExperience = crud.adminDelete(ExperienceModel)
