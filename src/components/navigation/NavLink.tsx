import { NavLink as RouterNavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface NavLinkProps {
  label: string
  href: string
  className?: string
  onClick?: () => void
}

/**
 * Primary nav item. The hairline underline half-draws on hover and
 * fully draws (in accent) under the active route — hover and active
 * states share one gesture rather than competing treatments.
 * `aria-current="page"` is set by react-router on the active link.
 */
export function NavLink({ label, href, className, onClick }: NavLinkProps) {
  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group relative py-2 text-body-sm font-medium text-text-secondary transition-colors duration-200',
          'hover:text-text',
          isActive && 'text-text',
          className,
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            className={cn(
              'absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-out-expo)]',
              isActive ? 'scale-x-100 bg-accent' : 'bg-text-tertiary group-hover:scale-x-100',
            )}
            aria-hidden="true"
          />
        </>
      )}
    </RouterNavLink>
  )
}
