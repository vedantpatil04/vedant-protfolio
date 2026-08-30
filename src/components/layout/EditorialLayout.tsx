import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EditorialLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Small monospace label sitting beside the heading, e.g. a date or category. */
  meta?: ReactNode
  heading: ReactNode
  children: ReactNode
}

/**
 * A narrow-measure reading layout with a meta rail — for long-form
 * content like case studies and journey entries.
 */
export function EditorialLayout({ meta, heading, children, className, ...props }: EditorialLayoutProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-8 lg:grid-cols-[160px_1fr] lg:gap-16', className)} {...props}>
      <div className="lg:pt-2">
        {meta && <div className="text-label text-text-tertiary">{meta}</div>}
      </div>
      <div className="max-w-[68ch]">
        <div className="mb-6">{heading}</div>
        {children}
      </div>
    </div>
  )
}
