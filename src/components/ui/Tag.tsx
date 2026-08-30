import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {}

/**
 * Lightweight technology / topic tag — distinct from Badge, which is
 * used for status. Rendered in monospace to read as a technical label.
 */
export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-border px-2 py-1 text-code text-[0.75rem] text-text-secondary',
        className,
      )}
      {...props}
    />
  )
}
