import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, rows = 5, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={!!error || undefined}
        className={cn(
          'w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-body-sm text-text',
          'placeholder:text-text-tertiary',
          'transition-colors duration-150 ease-out',
          'hover:border-border-strong focus:border-accent focus:outline-none',
          error && 'border-red-500/60 focus:border-red-500',
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
