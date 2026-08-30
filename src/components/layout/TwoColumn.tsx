import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TwoColumnProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  left: ReactNode
  right: ReactNode
  /** Column width ratio. Defaults to an even split. */
  ratio?: '1-1' | '3-2' | '2-3' | '2-1' | '1-2'
  gap?: 'sm' | 'md' | 'lg'
}

const RATIO_CLASS: Record<NonNullable<TwoColumnProps['ratio']>, string> = {
  '1-1': 'lg:grid-cols-2',
  '3-2': 'lg:grid-cols-5 [&>*:first-child]:lg:col-span-3 [&>*:last-child]:lg:col-span-2',
  '2-3': 'lg:grid-cols-5 [&>*:first-child]:lg:col-span-2 [&>*:last-child]:lg:col-span-3',
  '2-1': 'lg:grid-cols-3 [&>*:first-child]:lg:col-span-2',
  '1-2': 'lg:grid-cols-3 [&>*:last-child]:lg:col-span-2',
}

const GAP_CLASS = { sm: 'gap-6', md: 'gap-10', lg: 'gap-16' } as const

export function TwoColumn({ left, right, ratio = '1-1', gap = 'md', className, ...props }: TwoColumnProps) {
  return (
    <div className={cn('grid grid-cols-1', GAP_CLASS[gap], RATIO_CLASS[ratio], className)} {...props}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}
