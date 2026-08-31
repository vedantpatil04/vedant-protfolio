import { EducationModel } from '../models/Education'
import * as crud from '../utils/crud-factory'

export const listEducation = crud.publicList(EducationModel, { defaultSort: { order: 1 } })

export const createEducation = crud.adminCreate(EducationModel)
export const updateEducation = crud.adminUpdate(EducationModel)
export const deleteEducation = crud.adminDelete(EducationModel)
