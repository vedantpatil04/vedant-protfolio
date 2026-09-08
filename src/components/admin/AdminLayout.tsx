import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { Drawer, IconButton } from '@/components/ui'
import { Logo } from '@/components/shared'
import { AdminSidebar } from './AdminSidebar'

/**
 * Shell for every authenticated /admin/* route. Deliberately its own
 * layout rather than the public Navbar/Footer — App.tsx hides those
 * for /admin/* so this reads as a separate private workspace
 * (Phase 8 spec §5).
 */
export function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate(ROUTES.adminLogin, { replace: true })
  }

  return (
    <div className="flex min-h-dvh bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border p-6 lg:flex">
        <AdminSidebar onLogout={handleLogout} loggingOut={loggingOut} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <Logo />
          <IconButton
            aria-label="Open admin menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </IconButton>
        </header>

        <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} title="Admin" side="left">
          <AdminSidebar
            onNavigate={() => setMobileNavOpen(false)}
            onLogout={handleLogout}
            loggingOut={loggingOut}
          />
        </Drawer>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {admin && (
            <p className="mb-6 text-caption text-text-tertiary">
              Signed in as {admin.name} ({admin.email})
            </p>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
