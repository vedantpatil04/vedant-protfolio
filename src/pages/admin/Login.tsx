import { type FormEvent, useState } from 'react'
import { Lock } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Section, Container } from '@/components/layout'
import { Input, Button } from '@/components/ui'
import { Reveal, CornerBrackets } from '@/components/shared'
import { useToast } from '@/hooks/useToast'

/**
 * Admin auth UI shell. No real authentication is wired up yet — this
 * exists so the route and form structure are ready for the backend in
 * a later phase.
 */
export default function AdminLogin() {
  usePageTitle('Admin Login')
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      toast({
        variant: 'default',
        title: 'Admin auth is not implemented yet',
        description: 'This will connect to the backend once it exists.',
      })
    }, 500)
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
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="admin-email" className="text-label text-text-tertiary">
                  Email
                </label>
                <Input id="admin-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="admin-password" className="text-label text-text-tertiary">
                  Password
                </label>
                <Input id="admin-password" name="password" type="password" required autoComplete="current-password" />
              </div>
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
