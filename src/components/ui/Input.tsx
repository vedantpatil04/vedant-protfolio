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
          'h-10 w-full rounded-md border border-border bg-surface px-3 text-base sm:text-body-sm text-text',
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
Input.displayName = 'Input'
