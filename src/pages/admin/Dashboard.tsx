import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/hooks/useAuth'
import { Section, Container } from '@/components/layout'
import { SectionHeader, Button, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { ROUTES } from '@/constants/routes'

/**
 * Minimal authenticated shell — confirms the session works end to end
 * (shows who's signed in, offers logout). Real content management
 * (projects/certificates/etc CRUD UI) is a later phase.
 */
export default function AdminDashboard() {
  usePageTitle('Admin')
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate(ROUTES.adminLogin, { replace: true })
  }

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Restricted"
            title="Admin"
            description={admin ? `Signed in as ${admin.name} (${admin.email})` : undefined}
            action={
              <Button variant="outline" size="sm" onClick={handleLogout} loading={loggingOut}>
                <LogOut className="size-4" aria-hidden="true" />
                Log out
              </Button>
            }
          />
        </Reveal>
        <div className="mt-10">
          <Reveal delay={0.05}>
            <EmptyState
              icon={LayoutDashboard}
              title="Content management isn't built yet"
              description="Managing projects, certificates and achievements from here arrives in a later phase — the API foundation for it already exists."
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
