import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { PROJECT_STATUS_LABELS } from '@/constants/content-labels'
import { CornerBrackets } from '@/components/shared'

export interface ProjectMetaProps {
  project: Project
}

/**
 * Case-study fact sheet — the same corner-bracket "system panel"
 * language as the Hero, holding only fields the project record has.
 */
export function ProjectMeta({ project }: ProjectMetaProps) {
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null

  const rowClass = 'grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-3.5 last:border-b-0'

  return (
    <div className="relative border border-border bg-surface/70 p-5 sm:p-6">
      <CornerBrackets />
      <h2 className="text-label border-b border-border pb-4 text-text-tertiary">Project information</h2>

      <dl className="text-body-sm">
        {project.status && (
          <div className={rowClass}>
            <dt className="text-label pt-0.5 text-text-tertiary">Status</dt>
            <dd className="flex items-center gap-2 text-text">
              <span
                aria-hidden="true"
                className={project.status === 'published' ? 'size-1.5 bg-accent' : 'size-1.5 bg-border-strong'}
              />
              {PROJECT_STATUS_LABELS[project.status] ?? project.status}
            </dd>
          </div>
        )}

        {formattedDate && (
          <div className={rowClass}>
            <dt className="text-label pt-0.5 text-text-tertiary">Timeline</dt>
            <dd className="font-mono text-text tabular">{formattedDate}</dd>
          </div>
        )}

        {project.technologies.length > 0 && (
          <div className={rowClass}>
            <dt className="text-label pt-0.5 text-text-tertiary">Stack</dt>
            <dd className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[0.8125rem] text-text">
              {project.technologies.map((tech, i) => (
                <span key={tech} className="whitespace-nowrap">
                  {i > 0 && <span aria-hidden="true" className="mr-2 text-border-strong">/</span>}
                  {tech}
                </span>
              ))}
            </dd>
          </div>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className={rowClass}>
            <dt className="text-label pt-0.5 text-text-tertiary">Links</dt>
            <dd className="flex min-w-0 flex-col gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nudge-icons group inline-flex min-w-0 items-center gap-1.5 font-mono text-caption text-accent"
                >
                  <span className="link-underline truncate">{project.liveUrl.replace(/^https?:\/\//, '')}</span>
                  <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="sr-only">(live site, opens in a new tab)</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nudge-icons group inline-flex min-w-0 items-center gap-1.5 font-mono text-caption text-text-secondary transition-colors hover:text-text"
                >
                  <span className="link-underline truncate">
                    {project.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                  </span>
                  <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="sr-only">(source on GitHub, opens in a new tab)</span>
                </a>
              )}
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
