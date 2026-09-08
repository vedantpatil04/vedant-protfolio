import { NavLink as RouterNavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { ADMIN_NAV } from '@/constants/admin-nav'
import { ROUTES } from '@/constants/routes'
import { Logo } from '@/components/shared'
import { cn } from '@/lib/utils'

export interface AdminSidebarProps {
  onNavigate?: () => void
  onLogout: () => void
  loggingOut?: boolean
}

/** Shared nav list — rendered by the desktop sidebar and the mobile drawer alike. */
export function AdminSidebar({ onNavigate, onLogout, loggingOut }: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-1 pb-6">
        <Logo />
        <span className="mt-1 block text-label text-text-tertiary">Admin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
        {ADMIN_NAV.map((item) => (
          <RouterNavLink
            key={item.href}
            to={item.href}
            end={item.href === ROUTES.admin}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-body-sm font-medium text-text-secondary transition-colors',
                'hover:bg-surface-2 hover:text-text',
                isActive && 'bg-surface-2 text-text',
              )
            }
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </RouterNavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 text-body-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text disabled:opacity-50"
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        {loggingOut ? 'Logging out…' : 'Logout'}
      </button>
    </div>
  )
}
