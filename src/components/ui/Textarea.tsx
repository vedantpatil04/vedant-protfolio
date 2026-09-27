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
          'w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-base sm:text-body-sm text-text',
          'placeholder:text-text-tertiary',
          'transition-[border-color,box-shadow,background-color] duration-200 ease-out',
          'hover:border-border-strong focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15',
          error && 'border-danger/70 hover:border-danger focus:border-danger focus:ring-danger/15',
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
