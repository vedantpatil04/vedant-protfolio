import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import type { Project } from '@/types'
import { ROUTES } from '@/constants/routes'

export interface NextProjectNavProps {
  current: Project
  projects: Project[]
}

/** Closing navigation for a case study: back to the index, or straight on to the next story. */
export function NextProjectNav({ current, projects }: NextProjectNavProps) {
  const backLink = (
    <Link
      to={ROUTES.projects}
      className="nudge-icons inline-flex min-h-11 items-center gap-2 text-body-sm font-medium text-text-secondary transition-colors hover:text-text"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      <span className="link-underline">All projects</span>
    </Link>
  )

  if (!projects || projects.length <= 1) {
    return <div className="border-t border-border pt-8">{backLink}</div>
  }

  const currentIndex = projects.findIndex((p) => p.id === current.id || p.slug === current.slug)
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : projects[0]

  return (
    <div className="flex flex-col gap-8 border-t border-border pt-8">
      {nextProject && nextProject.id !== current.id && (
        <Link
          to={ROUTES.projectDetail(nextProject.slug)}
          className="nudge-icons group relative flex flex-col gap-3 border-b border-border pb-10"
        >
          <span className="text-label text-text-tertiary">Next case study</span>
          <span className="flex items-center justify-between gap-6">
            <span className="font-display text-[clamp(2rem,1.3rem+3.2vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-text transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 group-hover:text-accent">
              {nextProject.title}
            </span>
            <ArrowRight className="size-6 shrink-0 text-text-tertiary group-hover:text-accent sm:size-8" aria-hidden="true" />
          </span>
          {nextProject.shortDescription && (
            <span className="max-w-[56ch] text-body text-text-secondary line-clamp-2">{nextProject.shortDescription}</span>
          )}
        </Link>
      )}
      {backLink}
    </div>
  )
}
