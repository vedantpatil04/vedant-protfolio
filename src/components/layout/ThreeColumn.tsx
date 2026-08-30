import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ThreeColumnProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg'
}

const GAP_CLASS = { sm: 'gap-6', md: 'gap-8', lg: 'gap-10' } as const

export function ThreeColumn({ gap = 'md', className, children, ...props }: ThreeColumnProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', GAP_CLASS[gap], className)} {...props}>
      {children}
    </div>
  )
}
