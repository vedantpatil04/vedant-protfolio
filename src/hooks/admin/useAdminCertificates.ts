import { certificateService } from '@/services'
import type { Certificate } from '@/types'
import { useAdminResource } from './useAdminResource'

export function useAdminCertificates() {
  return useAdminResource<Certificate>(
    {
      list: certificateService.listAll,
      create: certificateService.create,
      update: certificateService.update,
      remove: certificateService.remove,
    },
    'Certificate',
  )
}
