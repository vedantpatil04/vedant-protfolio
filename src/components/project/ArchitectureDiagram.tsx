import { ArrowDown, Cpu, Database, Layout, Server } from 'lucide-react'

export interface ArchitectureDiagramProps {
  technologies?: string[]
}

export function ArchitectureDiagram({ technologies = [] }: ArchitectureDiagramProps) {
  return (
    <div className="rounded-md border border-border bg-surface-2/40 p-4 sm:p-6 md:p-8">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 font-mono text-body-sm">
        {/* Client Tier */}
        <div className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-1 rounded border border-border bg-surface px-3 sm:px-4 py-2.5 sm:py-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Layout className="size-4 text-accent shrink-0" aria-hidden="true" />
            <span className="font-semibold text-text">Client Tier</span>
          </div>
          <span className="text-caption text-text-tertiary">UI / Web Browser</span>
        </div>

        <ArrowDown className="size-4 text-text-tertiary" aria-hidden="true" />

        {/* API Tier */}
        <div className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-1 rounded border border-border bg-surface px-3 sm:px-4 py-2.5 sm:py-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Server className="size-4 text-accent shrink-0" aria-hidden="true" />
            <span className="font-semibold text-text">Service / API Layer</span>
          </div>
          <span className="text-caption text-text-tertiary">REST / Endpoints</span>
        </div>

        <ArrowDown className="size-4 text-text-tertiary" aria-hidden="true" />

        {/* Data Tier */}
        <div className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-1 rounded border border-border bg-surface px-3 sm:px-4 py-2.5 sm:py-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Database className="size-4 text-accent shrink-0" aria-hidden="true" />
            <span className="font-semibold text-text">Data Layer</span>
          </div>
          <span className="text-caption text-text-tertiary">Storage / State</span>
        </div>

        {technologies.length > 0 && (
          <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2 border-t border-border/60 pt-4 text-caption text-text-tertiary">
            <Cpu className="size-3.5" aria-hidden="true" />
            <span>Technologies in pipeline:</span>
            <span className="text-text">{technologies.slice(0, 5).join(' · ')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
