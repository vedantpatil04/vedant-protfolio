import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType
  /** Narrower max-width for text-heavy content (article bodies, forms). */
  narrow?: boolean
}

/**
 * The main horizontal-rhythm container. Every top-level section should
 * wrap its content in this rather than inventing bespoke max-width/padding.
 */
export function Container({ as: Tag = 'div', narrow, className, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-6 sm:px-8 lg:px-12 xl:px-16',
        narrow ? 'max-w-3xl' : 'max-w-[1400px]',
        className,
      )}
      {...props}
    />
  )
}
