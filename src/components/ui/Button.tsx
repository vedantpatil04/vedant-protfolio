import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * One interaction language for every button: a subtle background/border
 * transition, a 1px lift on hover (pressed back down on :active), and
 * directional icons nudging in their own direction (`.nudge-icons`, see
 * index.css). No scale transforms, no glow.
 */
export const buttonVariants = cva(
  [
    'nudge-icons inline-flex items-center justify-center gap-2 whitespace-nowrap select-none',
    'font-body text-body-sm font-medium',
    'rounded-md transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out',
    'motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-ink hover:bg-accent-hover',
        secondary:
          'bg-surface-2 text-text border border-border hover:border-border-strong hover:bg-surface',
        outline:
          'border border-border-strong/70 text-text bg-transparent hover:border-text hover:bg-surface',
        ghost:
          'text-text-secondary hover:text-text hover:bg-surface-2',
        link:
          'text-accent underline-offset-4 hover:underline p-0 h-auto rounded-none motion-safe:hover:translate-y-0',
        danger:
          'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3.5 text-[0.8125rem]',
        md: 'h-11 px-5',
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
