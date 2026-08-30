import { Code2, Briefcase, Mail } from 'lucide-react'
import { Container } from './Container'
import { Divider } from '@/components/ui'
import { profile } from '@/data/profile'

/**
 * Minimal, restrained footer. Only renders links that actually exist
 * in the profile config — no placeholder icons pointing nowhere.
 */
export function Footer() {
  const year = new Date().getFullYear()

  const links = [
    profile.github && { label: 'GitHub', href: profile.github, icon: Code2 },
    profile.linkedin && { label: 'LinkedIn', href: profile.linkedin, icon: Briefcase },
    profile.email && { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
  ].filter(Boolean) as { label: string; href: string; icon: typeof Code2 }[]

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-body font-semibold text-text">{profile.name}</p>
            <p className="mt-1 text-body-sm text-text-secondary">{profile.title}</p>
          </div>

          {links.length > 0 && (
            <div className="flex items-center gap-4">
              {links.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={label}
                  className="text-text-tertiary transition-colors hover:text-accent"
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        <Divider />

        <p className="text-caption text-text-tertiary">© {year} {profile.name}. All rights reserved.</p>
      </Container>
    </footer>
  )
}
