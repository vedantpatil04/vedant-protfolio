import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section, AsymmetricLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { CornerBrackets, Reveal } from '@/components/shared'
import { profile } from '@/data/profile'
import { ROUTES } from '@/constants/routes'

const STACK = ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB']

/**
 * The page's thesis statement. An asymmetric split pairs the headline
 * with a compact "status panel" — the recurring corner-bracket motif
 * framing real, current information instead of a stat block.
 */
export function Hero() {
  return (
    <Section compact as="div" className="pt-14 sm:pt-20">
      <AsymmetricLayout
        primary={
          <Reveal>
            <span className="text-label text-accent">Full-stack developer</span>
            <h1 className="text-display mt-4 text-text text-balance">
              {profile.name}
            </h1>
            {profile.tagline && (
              <p className="mt-6 max-w-lg text-body-lg text-text-secondary">{profile.tagline}</p>
            )}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link to={ROUTES.projects}>
                  View work
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={ROUTES.contact}>Get in touch</Link>
              </Button>
            </div>
          </Reveal>
        }
        secondary={
          <Reveal delay={0.1}>
            <div className="relative border border-border bg-surface p-6">
              <CornerBrackets />
              <dl className="flex flex-col gap-5">
                <div>
                  <dt className="text-label text-text-tertiary">Role</dt>
                  <dd className="mt-1.5 text-body text-text">{profile.title}</dd>
                </div>
                <div>
                  <dt className="text-label text-text-tertiary">Stack</dt>
                  <dd className="mt-1.5 text-code text-text-secondary">{STACK.join(' · ')}</dd>
                </div>
                {profile.location && (
                  <div>
                    <dt className="text-label text-text-tertiary">Location</dt>
                    <dd className="mt-1.5 flex items-center gap-1.5 text-body-sm text-text-secondary">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {profile.location}
                    </dd>
                  </div>
                )}
                {profile.availability && (
                  <div>
                    <dt className="text-label text-text-tertiary">Status</dt>
                    <dd className="mt-1.5 flex items-center gap-2 text-body-sm text-text">
                      <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      {profile.availability === 'open-to-work' && 'Open to work'}
                      {profile.availability === 'open-to-freelance' && 'Open to freelance'}
                      {profile.availability === 'not-available' && 'Not currently available'}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        }
      />
    </Section>
  )
}
