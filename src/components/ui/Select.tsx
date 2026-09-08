import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

/**
 * Native <select> styled to match Input/Textarea — chosen over a
 * Radix-based combobox to avoid a new dependency for what is, in every
 * admin form, a short fixed list of options.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, id, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error || undefined}
          className={cn(
            'h-10 w-full appearance-none rounded-md border border-border bg-surface px-3 pr-9 text-base sm:text-body-sm text-text',
            'transition-colors duration-150 ease-out',
            'hover:border-border-strong focus:border-accent focus:outline-none',
            error && 'border-red-500/60 focus:border-red-500',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary"
          aria-hidden="true"
        />
      </div>
    )
  },
)
Select.displayName = 'Select'
