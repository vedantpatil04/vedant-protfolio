import { projectService } from '@/services'
import type { Project } from '@/types'
import { useAdminResource } from './useAdminResource'

export function useAdminProjects() {
  return useAdminResource<Project>(
    {
      list: projectService.listAll,
      create: projectService.create,
      update: projectService.update,
      remove: projectService.remove,
    },
    'Project',
  )
}
