export interface TechnologyOverviewProps {
  technologies: string[]
}

/** The project's stack as a clean indexed list — typographic rather than icon tiles. */
export function TechnologyOverview({ technologies }: TechnologyOverviewProps) {
  if (!technologies || technologies.length === 0) return null

  return (
    <ul className="grid grid-cols-1 gap-x-10 xs:grid-cols-2">
      {technologies.map((tech, i) => (
        <li key={tech} className="flex items-baseline gap-4 border-b border-border py-3.5">
          <span className="text-label w-6 shrink-0 tabular text-text-tertiary">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-body-lg font-medium text-text">{tech}</span>
        </li>
      ))}
    </ul>
  )
}
