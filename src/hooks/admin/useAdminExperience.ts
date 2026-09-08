import { experienceService } from '@/services'
import type { Experience } from '@/types'
import { useAdminResource } from './useAdminResource'

export function useAdminExperience() {
  return useAdminResource<Experience>(
    {
      list: experienceService.list,
      create: experienceService.create,
      update: experienceService.update,
      remove: experienceService.remove,
    },
    'Experience entry',
  )
}
