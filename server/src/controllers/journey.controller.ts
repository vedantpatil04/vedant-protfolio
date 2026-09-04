import { JourneyModel } from '../models/Journey'
import * as crud from '../utils/crud-factory'

// Ascending — the timeline reads oldest → newest ("how I got here"),
// unlike Certificates/Achievements/Projects which read newest-first.
export const listJourney = crud.publicList(JourneyModel, { defaultSort: { date: 1 } })

export const createJourney = crud.adminCreate(JourneyModel)
export const updateJourney = crud.adminUpdate(JourneyModel)
export const deleteJourney = crud.adminDelete(JourneyModel)
