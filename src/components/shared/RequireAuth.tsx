import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from '@/components/ui'
import { ROUTES } from '@/constants/routes'

/**
 * Gates any admin-only route. Shows a loading state while the session
 * check is in flight, then redirects to /admin/login (preserving the
 * originally requested path) if there's no valid session.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loading label="Checking session" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.adminLogin} state={{ from: location }} replace />
  }

  return <>{children}</>
}
