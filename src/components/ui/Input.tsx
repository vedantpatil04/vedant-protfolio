import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, ...props }, ref) => {
    return (
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error || undefined}
        className={cn(
          'h-10 w-full rounded-md border border-border bg-surface px-3 text-body-sm text-text',
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
Input.displayName = 'Input'
