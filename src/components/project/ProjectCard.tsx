import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/types'
import { ROUTES } from '@/constants/routes'
import { CornerBrackets } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getCaseStudyChapters } from './case-study'

export interface ProjectCardProps {
  project: Project
  index?: number
  priority?: boolean
  className?: string
  /** Heading level — h2 on /projects (directly under the page h1), h3 inside homepage chapters. */
  titleAs?: 'h2' | 'h3'
}

/**
 * Editorial project row: copy on one side, the real screenshot on the
 * other (alternating sides on wide screens for rhythm). Hover language:
 * the accent rule draws across the top, the title shifts a few pixels,
 * the image settles in slightly, the arrow nudges. The whole row is one
 * link. Nothing here is invented — the "case study" chapter list simply
 * names which written sections exist for the project.
 */
export function ProjectCard({ project, index, priority = false, className, titleAs = 'h3' }: ProjectCardProps) {
  const Title = titleAs
  const indexFormatted = index !== undefined ? String(index + 1).padStart(2, '0') : null
  const chapters = getCaseStudyChapters(project)
  const flip = index !== undefined && index % 2 === 1

  return (
    <article className={cn('group relative border-t border-border', className)}>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-within:scale-x-100"
      />
      <Link
        to={ROUTES.projectDetail(project.slug)}
        className="grid grid-cols-1 gap-7 py-8 focus-visible:outline-offset-4 sm:py-10 md:grid-cols-12 md:gap-10 lg:py-14"
      >
        {/* Copy */}
        <div className={cn('flex flex-col md:col-span-5', flip && 'md:order-2 md:col-start-8')}>
          <div className="flex items-center gap-3 text-label text-text-tertiary">
            {indexFormatted && <span className="tabular text-accent">{indexFormatted}</span>}
            {project.featured && (
              <>
                <span aria-hidden="true" className="h-px w-4 bg-border-strong" />
                <span>Featured</span>
              </>
            )}
          </div>

          <Title className="mt-4 font-display text-[clamp(1.6rem,1.2rem+1.7vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-text transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 group-hover:text-accent">
            {project.title}
          </Title>

          <p className="mt-4 max-w-[46ch] text-body-lg text-text-secondary line-clamp-3">{project.shortDescription}</p>

          {project.technologies.length > 0 && (
            <p className="mt-5 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[0.8125rem] text-text-tertiary">
              {project.technologies.slice(0, 6).map((tech, i) => (
                <span key={tech} className="whitespace-nowrap">
                  {i > 0 && <span aria-hidden="true" className="mr-2 text-border-strong">/</span>}
                  {tech}
                </span>
              ))}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-4 md:mt-auto md:pt-8">
            {chapters.length > 0 && (
              <p className="text-caption text-text-tertiary">
                <span className="text-label mr-2">Case study</span>
                {chapters.join(' · ')}
              </p>
            )}
            <span className="nudge-icons inline-flex items-center gap-2 text-body-sm font-medium text-text">
              <span className="link-underline">{chapters.length > 0 ? 'Read the case study' : 'View project'}</span>
              <ArrowRight className="size-4 text-accent" aria-hidden="true" />
            </span>
          </div>
        </div>

        {/* Preview */}
        <div className={cn('md:col-span-7', flip && 'md:order-1 md:col-start-1')}>
          <ProjectPreview project={project} priority={priority} />
        </div>
      </Link>
    </article>
  )
}

function ProjectPreview({ project, priority }: { project: Project; priority: boolean }) {
  if (project.thumbnail) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-surface-2">
        <img
          src={project.thumbnail}
          alt={`${project.title} — screenshot`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className="size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-black/5 dark:ring-white/5"
        />
      </div>
    )
  }

  // No screenshot published yet — an honest typographic plate, not a fake mockup.
  return (
    <div className="relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-md border border-border bg-surface p-5 sm:p-7">
      <CornerBrackets className="inset-3 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="text-label text-text-tertiary">{project.slug}</span>
      <span className="font-display text-[clamp(2rem,1.2rem+3vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-border-strong transition-colors duration-500 group-hover:text-text-tertiary">
        {project.title}
      </span>
      <span className="text-caption text-text-tertiary">Preview not published yet</span>
    </div>
  )
}
