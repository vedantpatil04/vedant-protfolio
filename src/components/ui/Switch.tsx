import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  description?: string
}

/**
 * Accessible toggle built on a native checkbox (visually hidden) rather
 * than a new Radix dependency — keyboard/focus/label semantics come
 * for free, and it's a single boolean control used throughout the CMS
 * (featured, publish, availability).
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const generatedId = id ?? props.name
    return (
      <label
        htmlFor={generatedId}
        className={cn(
          'flex cursor-pointer items-start gap-3',
          props.disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <span className="relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center">
          <input
            ref={ref}
            id={generatedId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              'h-6 w-10 rounded-full bg-surface-2 border border-border transition-colors duration-150',
              'peer-checked:bg-accent peer-checked:border-accent',
              'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-focus-ring)]',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-150',
              'peer-checked:translate-x-4',
            )}
          />
        </span>
        {(label || description) && (
          <span className="flex flex-col gap-0.5">
            {label && <span className="text-body-sm font-medium text-text">{label}</span>}
            {description && <span className="text-caption text-text-secondary">{description}</span>}
          </span>
        )}
      </label>
    )
  },
)
Switch.displayName = 'Switch'
