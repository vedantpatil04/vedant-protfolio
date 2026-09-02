import { Link } from 'react-router-dom'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Section } from '@/components/layout'
import { Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  usePageTitle('Page Not Found', 'The requested page could not be found.')

  return (
    <Section className="flex min-h-[70vh] items-center justify-center">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-surface-2 border border-border text-accent mb-6">
            <FileQuestion className="size-7" aria-hidden="true" />
          </div>
          <span className="block text-label text-accent mb-2">404 Error</span>
          <h1 className="text-h1 text-text mb-4">Page not found</h1>
          <p className="text-body text-text-secondary mb-8">
            The page you're looking for doesn't exist, was removed, or the link may be broken.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="primary">
              <Link to={ROUTES.home}>
                <Home className="size-4" aria-hidden="true" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to={ROUTES.projects}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                View Projects
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
