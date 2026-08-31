import { AchievementModel } from '../models/Achievement'
import * as crud from '../utils/crud-factory'

export const listAchievements = crud.publicList(AchievementModel, { defaultSort: { date: -1 } })

export const listAllAchievements = crud.adminList(AchievementModel, { defaultSort: { date: -1 } })
export const createAchievement = crud.adminCreate(AchievementModel)
export const updateAchievement = crud.adminUpdate(AchievementModel)
export const deleteAchievement = crud.adminDelete(AchievementModel)
