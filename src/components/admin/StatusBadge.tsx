import type { ProjectStatus } from '@/types'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<ProjectStatus, string> = {
  published: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400',
  draft: 'bg-surface-2 text-text-secondary border-border',
  archived: 'bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400',
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  published: 'Published',
  draft: 'Draft',
  archived: 'Archived',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge className={cn(STATUS_STYLES[status])}>{STATUS_LABELS[status]}</Badge>
}
