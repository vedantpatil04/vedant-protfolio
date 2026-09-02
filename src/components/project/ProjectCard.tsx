import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { ROUTES } from '@/constants/routes'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface ProjectCardProps {
  project: Project
  index?: number
  priority?: boolean
  className?: string
}

export function ProjectCard({ project, index, priority = false, className }: ProjectCardProps) {
  const indexFormatted = index !== undefined ? String(index + 1).padStart(2, '0') : null

  return (
    <article
      className={cn(
        'group relative border-b border-border py-8 sm:py-10 transition-colors hover:border-accent/60',
        className,
      )}
    >
      <Link
        to={ROUTES.projectDetail(project.slug)}
        className="block focus-visible:outline-none"
        aria-label={`View case study for ${project.title}`}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[120px_1fr_auto] md:gap-8 items-start">
          {/* Index / Label */}
          <div className="flex items-center gap-3">
            {indexFormatted && (
              <span className="font-mono text-label text-text-tertiary group-hover:text-accent transition-colors">
                {indexFormatted}
              </span>
            )}
            {project.featured && (
              <Badge variant="accent" className="text-caption">
                Featured
              </Badge>
            )}
          </div>

          {/* Core Info */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-h3 text-text group-hover:text-accent transition-colors flex items-center gap-2">
              {project.title}
            </h3>
            <p className="max-w-2xl text-body text-text-secondary line-clamp-2">
              {project.shortDescription}
            </p>

            {project.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-caption text-text-tertiary bg-surface-2 px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Arrow / CTA */}
          <div className="hidden md:flex items-center justify-end">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary group-hover:border-accent group-hover:text-accent group-hover:bg-accent/5 transition-all">
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Thumbnail preview if priority or available */}
        {priority && project.thumbnail && (
          <div className="mt-6 overflow-hidden rounded-md border border-border aspect-video max-h-72 w-full bg-surface-2">
            <img
              src={project.thumbnail}
              alt={`${project.title} thumbnail`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </Link>
    </article>
  )
}
