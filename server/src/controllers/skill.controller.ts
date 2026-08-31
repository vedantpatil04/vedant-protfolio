import { SkillModel } from '../models/Skill'
import * as crud from '../utils/crud-factory'

export const listSkills = crud.publicList(SkillModel, { defaultSort: { order: 1 } })

export const createSkill = crud.adminCreate(SkillModel)
export const updateSkill = crud.adminUpdate(SkillModel)
export const deleteSkill = crud.adminDelete(SkillModel)
