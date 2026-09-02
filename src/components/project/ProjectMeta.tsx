import { Calendar, CheckCircle2, Globe, Code2, Layers } from 'lucide-react'
import type { Project } from '@/types'
import { Badge } from '@/components/ui'

export interface ProjectMetaProps {
  project: Project
}

export function ProjectMeta({ project }: ProjectMetaProps) {
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <div className="flex flex-col gap-6 rounded-md border border-border bg-surface p-6">
      <h3 className="text-label text-text-tertiary">Project Information</h3>

      <div className="flex flex-col gap-4 text-body-sm">
        {project.status && (
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="size-4 text-text-tertiary" aria-hidden="true" />
              Status
            </span>
            <Badge variant={project.status === 'published' ? 'accent' : 'neutral'}>
              {project.status}
            </Badge>
          </div>
        )}

        {formattedDate && (
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="flex items-center gap-2 text-text-secondary">
              <Calendar className="size-4 text-text-tertiary" aria-hidden="true" />
              Timeline
            </span>
            <span className="font-mono text-text">{formattedDate}</span>
          </div>
        )}

        {project.technologies.length > 0 && (
          <div className="flex flex-col gap-2 border-b border-border/60 pb-3">
            <span className="flex items-center gap-2 text-text-secondary">
              <Layers className="size-4 text-text-tertiary" aria-hidden="true" />
              Stack
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-surface-2 px-2 py-0.5 font-mono text-caption text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-caption text-text-tertiary">Direct Links</span>
            <div className="flex flex-col gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-caption text-accent hover:underline"
                >
                  <Globe className="size-3.5" aria-hidden="true" />
                  {project.liveUrl.replace(/^https?:\/\//, '')}
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-caption text-text-secondary hover:text-text hover:underline"
                >
                  <Code2 className="size-3.5" aria-hidden="true" />
                  {project.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
