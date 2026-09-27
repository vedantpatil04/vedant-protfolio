import { Database, Layout, Server } from 'lucide-react'

export interface ArchitectureDiagramProps {
  technologies?: string[]
}

const TIERS = [
  { icon: Layout, name: 'Client tier', detail: 'UI / web browser' },
  { icon: Server, name: 'Service / API layer', detail: 'REST / endpoints' },
  { icon: Database, name: 'Data layer', detail: 'Storage / state' },
]

/**
 * Generic three-tier trace (the same interface → service → data path
 * the Hero's signal strip draws), with the project's own technologies
 * listed underneath. Structural, not a claim about specific internals.
 */
export function ArchitectureDiagram({ technologies = [] }: ArchitectureDiagramProps) {
  return (
    <div className="rounded-md border border-border bg-surface/60 p-4 sm:p-6 md:p-8">
      <div className="relative mx-auto max-w-md">
        <span aria-hidden="true" className="absolute bottom-6 left-[1.5rem] top-6 w-px bg-border-strong sm:left-[1.75rem]" />
        <ol className="relative flex flex-col gap-3">
        {TIERS.map(({ icon: Icon, name, detail }) => (
          <li
            key={name}
            className="relative flex flex-col gap-1 rounded-md border border-border bg-surface px-3 py-3 xs:flex-row xs:items-center xs:justify-between sm:px-4"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-sm border border-border bg-bg">
                <Icon className="size-3.5 text-accent" aria-hidden="true" />
              </span>
              <span className="text-body-sm font-semibold text-text">{name}</span>
            </span>
            <span className="pl-9 font-mono text-caption text-text-tertiary xs:pl-0">{detail}</span>
          </li>
        ))}
        </ol>
      </div>

      {technologies.length > 0 && (
        <p className="mx-auto mt-6 max-w-md border-t border-border pt-4 text-center font-mono text-caption text-text-tertiary">
          <span className="text-label mr-2">In this project</span>
          <span className="text-text">{technologies.slice(0, 5).join(' · ')}</span>
        </p>
      )}
    </div>
  )
}
