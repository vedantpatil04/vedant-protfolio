import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  /** Use 'h1' when the empty state *is* the page (e.g. a not-found detail route). */
  titleAs?: 'p' | 'h1' | 'h2'
}

/**
 * Used wherever real content is not yet available (e.g. an empty
 * projects grid). Explains what's missing rather than showing fake data.
 */
export function EmptyState({ icon: Icon, title, description, action, className, titleAs: Title = 'p' }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border px-6 py-16 text-center',
        className,
      )}
    >
      {Icon && <Icon className="size-6 text-text-tertiary" aria-hidden="true" />}
      <Title className="font-body text-body font-medium tracking-normal text-text">{title}</Title>
      {description && <p className="max-w-sm text-body-sm text-text-secondary">{description}</p>}
      {action}
    </div>
  )
}
