import { skillService } from '@/services'
import type { Skill } from '@/types'
import { useAdminResource } from './useAdminResource'

export function useAdminSkills() {
  return useAdminResource<Skill>(
    {
      list: skillService.list,
      create: skillService.create,
      update: skillService.update,
      remove: skillService.remove,
    },
    'Skill',
  )
}
