import { journeyService } from '@/services'
import type { JourneyEntry } from '@/types'
import { useAdminResource } from './useAdminResource'

export function useAdminJourney() {
  return useAdminResource<JourneyEntry>(
    {
      list: journeyService.list,
      create: journeyService.create,
      update: journeyService.update,
      remove: journeyService.remove,
    },
    'Journey entry',
  )
}
