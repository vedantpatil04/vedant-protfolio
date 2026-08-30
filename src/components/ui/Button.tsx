import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-body text-body-sm font-medium',
    'rounded-md transition-colors duration-150 ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-ink hover:bg-accent-hover',
        secondary:
          'bg-surface-2 text-text border border-border hover:border-border-strong',
        outline:
          'border border-border text-text hover:border-accent hover:text-accent bg-transparent',
        ghost:
          'text-text-secondary hover:text-text hover:bg-surface-2',
        link:
          'text-accent underline-offset-4 hover:underline p-0 h-auto rounded-none',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-body',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  /** Render as the child element (e.g. a router <Link>) instead of a <button>. */
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={asChild ? undefined : disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {asChild ? <Slottable>{children}</Slottable> : children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'
