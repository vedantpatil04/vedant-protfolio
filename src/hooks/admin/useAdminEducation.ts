import { educationService } from '@/services'
import type { Education } from '@/types'
import { useAdminResource } from './useAdminResource'

export function useAdminEducation() {
  return useAdminResource<Education>(
    {
      list: educationService.list,
      create: educationService.create,
      update: educationService.update,
      remove: educationService.remove,
    },
    'Education entry',
  )
}
