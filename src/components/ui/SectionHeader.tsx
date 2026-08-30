import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/**
 * Standard heading block used at the top of every homepage / page
 * section, so heading rhythm stays consistent site-wide.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'left'
          ? 'sm:flex-row sm:items-end sm:justify-between'
          : 'items-center text-center',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow && <span className="text-label text-accent">{eyebrow}</span>}
        <h2 className="text-h2 text-text">{title}</h2>
        {description && (
          <p className={cn('max-w-xl text-body-lg text-text-secondary', align === 'center' && 'mx-auto')}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
