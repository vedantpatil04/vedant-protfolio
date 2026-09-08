import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AdminPageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/**
 * Standard header for every admin page — title/description on the
 * left, a primary action (Add X, Save) on the right. Deliberately
 * plainer than the public SectionHeader per Phase 8 spec §6 (utility
 * over decoration).
 */
export function AdminPageHeader({ title, description, action, className }: AdminPageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="text-h3 text-text">{title}</h1>
        {description && <p className="mt-1 text-body-sm text-text-secondary">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
