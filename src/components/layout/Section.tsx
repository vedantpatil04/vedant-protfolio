import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** Removes the container/padding — for sections that manage their own full-bleed layout. */
  fullWidth?: boolean
  /** Reduces vertical padding — for compact sections. */
  compact?: boolean
}

/**
 * Standard vertical rhythm wrapper for page sections. Handles the
 * section-level Container internally unless `fullWidth` is set.
 */
export function Section({
  as: Tag = 'section',
  fullWidth,
  compact,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(compact ? 'py-14 sm:py-16' : 'py-16 sm:py-24 lg:py-28', className)}
      {...props}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12 xl:px-16">{children}</div>
      )}
    </Tag>
  )
}
