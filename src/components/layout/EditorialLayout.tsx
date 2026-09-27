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
 * content like case studies and journey entries. On wide screens the
 * meta label stays pinned beside its chapter while the text scrolls.
 */
export function EditorialLayout({ meta, heading, children, className, ...props }: EditorialLayoutProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr] lg:gap-16', className)} {...props}>
      <div className="lg:sticky lg:top-28 lg:self-start lg:pt-3">
        {meta && <div className="text-label text-text-tertiary">{meta}</div>}
      </div>
      <div className="max-w-[68ch]">
        <div className="mb-6 sm:mb-8">{heading}</div>
        {children}
      </div>
    </div>
  )
}
