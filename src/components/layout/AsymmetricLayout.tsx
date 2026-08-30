import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AsymmetricLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  primary: ReactNode
  secondary: ReactNode
  /** Which side the larger "primary" pane sits on. */
  primarySide?: 'left' | 'right'
}

/**
 * A deliberately uneven split (roughly 2:1) used to break out of a
 * purely centered/card-grid rhythm — e.g. hero content beside a
 * technical meta panel.
 */
export function AsymmetricLayout({
  primary,
  secondary,
  primarySide = 'left',
  className,
  ...props
}: AsymmetricLayoutProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14',
        primarySide === 'right' && 'lg:grid-cols-[1fr_1.6fr]',
        className,
      )}
      {...props}
    >
      <div className={cn(primarySide === 'right' && 'lg:order-2')}>{primary}</div>
      <div className={cn(primarySide === 'right' && 'lg:order-1')}>{secondary}</div>
    </div>
  )
}
