import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a subtle hover elevation — use for interactive/clickable cards only. */
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border border-border bg-surface p-6',
          interactive &&
            'transition-colors duration-150 ease-out hover:border-border-strong',
          className,
        )}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'
