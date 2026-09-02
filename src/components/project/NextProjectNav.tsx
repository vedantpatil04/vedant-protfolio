import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import type { Project } from '@/types'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui'

export interface NextProjectNavProps {
  current: Project
  projects: Project[]
}

export function NextProjectNav({ current, projects }: NextProjectNavProps) {
  if (!projects || projects.length <= 1) {
    return (
      <div className="flex items-center justify-between border-t border-border pt-8">
        <Button asChild variant="outline">
          <Link to={ROUTES.projects}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            All projects
          </Link>
        </Button>
      </div>
    )
  }

  const currentIndex = projects.findIndex((p) => p.id === current.id || p.slug === current.slug)
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : projects[0]

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
      <Button asChild variant="ghost">
        <Link to={ROUTES.projects}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          All projects
        </Link>
      </Button>

      {nextProject && nextProject.id !== current.id && (
        <Link
          to={ROUTES.projectDetail(nextProject.slug)}
          className="group flex flex-col items-start gap-1 rounded-md border border-border p-4 transition-colors hover:border-accent hover:bg-surface-2 sm:items-end"
        >
          <span className="text-caption text-text-tertiary">Next Project</span>
          <span className="flex items-center gap-2 font-display text-body font-semibold text-text group-hover:text-accent">
            {nextProject.title}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      )}
    </div>
  )
}
