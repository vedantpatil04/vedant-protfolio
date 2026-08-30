import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center shrink-0',
    'rounded-md transition-colors duration-150 ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
  ].join(' '),
  {
    variants: {
      variant: {
        ghost: 'text-text-secondary hover:text-text hover:bg-surface-2',
        outline: 'border border-border text-text hover:border-accent hover:text-accent',
        solid: 'bg-accent text-accent-ink hover:bg-accent-hover',
      },
      size: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-10 [&_svg]:size-[18px]',
        lg: 'size-12 [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
)

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Required — icon-only buttons must be labeled for assistive tech. */
  'aria-label': string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(iconButtonVariants({ variant, size }), className)} {...props}>
        {children}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'
