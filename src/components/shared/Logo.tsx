import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { profile } from '@/data/profile'
import { cn } from '@/lib/utils'

/**
 * Wordmark rather than an icon logo — keeps the identity typographic,
 * matching a portfolio whose personality lives in its type system.
 */
export function Logo({ className }: { className?: string }) {
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <Link
      to={ROUTES.home}
      aria-label={`${profile.name} — home`}
      className={cn(
        'font-display text-body font-extrabold tracking-tight text-text',
        'transition-colors hover:text-accent',
        className,
      )}
    >
      <span className="hidden sm:inline">{profile.name.toUpperCase()}</span>
      <span className="sm:hidden">{initials}</span>
    </Link>
  )
}
