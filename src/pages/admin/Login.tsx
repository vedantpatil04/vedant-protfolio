import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Lock, TriangleAlert } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/hooks/useAuth'
import { Section, Container } from '@/components/layout'
import { Input, Button } from '@/components/ui'
import { Reveal, CornerBrackets } from '@/components/shared'
import { ApiError } from '@/services'
import { ROUTES } from '@/constants/routes'

export default function AdminLogin() {
  usePageTitle('Admin Login')
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Already signed in — no reason to show the login form.
  if (status === 'authenticated') {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? ROUTES.admin
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login({ email, password })
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? ROUTES.admin
      navigate(redirectTo, { replace: true })
    } catch (err) {
      // Deliberately generic — mirrors the server's "don't reveal which
      // field was wrong" behavior.
      if (err instanceof ApiError && err.status === 429) {
        setError('Too many attempts. Wait a few minutes and try again.')
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container narrow>
        <Reveal>
          <div className="relative mx-auto max-w-sm border border-border bg-surface p-8">
            <CornerBrackets />
            <div className="flex flex-col items-center gap-2 text-center">
              <Lock className="size-5 text-accent" aria-hidden="true" />
              <h1 className="text-h3 text-text">Admin sign in</h1>
              <p className="text-body-sm text-text-secondary">Restricted area</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="admin-email" className="text-label text-text-tertiary">
                  Email
                </label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error ?? undefined}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="admin-password" className="text-label text-text-tertiary">
                  Password
                </label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error ?? undefined}
                />
              </div>

              {error && (
                <p role="alert" className="flex items-center gap-2 text-body-sm text-red-500">
                  <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}

              <Button type="submit" loading={submitting} className="w-full">
                Sign in
              </Button>
            </form>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
