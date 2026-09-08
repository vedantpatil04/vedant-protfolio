import { achievementService } from '@/services'
import type { Achievement } from '@/types'
import { useAdminResource } from './useAdminResource'

export function useAdminAchievements() {
  return useAdminResource<Achievement>(
    {
      list: achievementService.listAll,
      create: achievementService.create,
      update: achievementService.update,
      remove: achievementService.remove,
    },
    'Achievement',
  )
}
