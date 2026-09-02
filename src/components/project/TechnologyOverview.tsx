import { Code2 } from 'lucide-react'

export interface TechnologyOverviewProps {
  technologies: string[]
}

export function TechnologyOverview({ technologies }: TechnologyOverviewProps) {
  if (!technologies || technologies.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {technologies.map((tech) => (
        <div
          key={tech}
          className="flex items-center gap-2.5 rounded-md border border-border bg-surface-2/60 px-4 py-3 text-body-sm font-medium text-text"
        >
          <Code2 className="size-4 text-accent shrink-0" aria-hidden="true" />
          <span>{tech}</span>
        </div>
      ))}
    </div>
  )
}
