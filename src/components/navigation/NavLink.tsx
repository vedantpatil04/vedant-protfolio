import { NavLink as RouterNavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface NavLinkProps {
  label: string
  href: string
  className?: string
  onClick?: () => void
}

/** Primary nav item — underline slides in under the active route. */
export function NavLink({ label, href, className, onClick }: NavLinkProps) {
  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'relative py-1.5 text-body-sm font-medium text-text-secondary transition-colors duration-150',
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
              'absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-200 ease-out origin-left',
              isActive && 'scale-x-100',
            )}
            aria-hidden="true"
          />
        </>
      )}
    </RouterNavLink>
  )
}
