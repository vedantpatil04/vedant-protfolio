import { ArrowUp, ArrowUpRight, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Container } from './Container'
import { cn } from '@/lib/utils'
import { profile } from '@/data/profile'
import { PRIMARY_NAV } from '@/constants/nav-links'
import { ROUTES } from '@/constants/routes'

/**
 * Closing frame of every public page: a single invitation to get in
 * touch, the site index, real profile links, and a back-to-top control.
 * Only renders links that actually exist in the profile config — no
 * placeholder icons pointing nowhere.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const { pathname } = useLocation()
  // Home and /contact already end with the contact form — no invitation to itself.
  const hideInvite = pathname === ROUTES.contact || pathname === ROUTES.home

  const pages = [
    ...PRIMARY_NAV,
    { label: 'Achievements', href: ROUTES.achievements },
    { label: 'Resume', href: ROUTES.resume },
  ]

  const elsewhere = [
    profile.github && { label: 'GitHub', href: profile.github },
    profile.linkedin && { label: 'LinkedIn', href: profile.linkedin },
    profile.leetcode && { label: 'LeetCode', href: profile.leetcode },
    profile.email && { label: 'Email', href: `mailto:${profile.email}` },
  ].filter(Boolean) as { label: string; href: string }[]

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <footer className="mt-8 border-t border-border sm:mt-12">
      <Container className="flex flex-col py-14 sm:py-20">
        {/* Invitation */}
        {!hideInvite && (
          <Link
            to={ROUTES.contact}
            className="nudge-icons group flex flex-col gap-4 border-b border-border pb-12 sm:flex-row sm:items-end sm:justify-between sm:pb-16"
          >
            <span className="flex flex-col gap-3">
              <span className="text-label text-text-tertiary">Next step</span>
              <span className="font-display text-[clamp(2rem,1.3rem+3vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-text transition-colors duration-300 group-hover:text-accent">
                Let’s build something.
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-body font-medium text-text-secondary transition-colors group-hover:text-text">
              <span className="link-underline">Get in touch</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        )}

        {/* Index */}
        <div className={cn('grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8', !hideInvite && 'pt-12 sm:pt-14')}>
          <div className="col-span-2 flex flex-col gap-1.5">
            <p className="font-display text-body font-bold text-text">{profile.name}</p>
            <p className="text-body-sm text-text-secondary">{profile.title}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="text-label text-text-tertiary">Pages</span>
            <ul className="flex flex-col gap-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    to={page.href}
                    className="link-underline text-body-sm text-text-secondary transition-colors hover:text-text"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {elsewhere.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-label text-text-tertiary">Elsewhere</span>
              <ul className="flex flex-col gap-2">
                {elsewhere.map((link) => {
                  const isHttp = link.href.startsWith('http')
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={isHttp ? '_blank' : undefined}
                        rel={isHttp ? 'noreferrer' : undefined}
                        className="nudge-icons inline-flex items-center gap-1 text-body-sm text-text-secondary transition-colors hover:text-text"
                      >
                        <span className="link-underline">{link.label}</span>
                        <ArrowUpRight className="size-3.5 text-text-tertiary" aria-hidden="true" />
                        {isHttp && <span className="sr-only">(opens in a new tab)</span>}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Baseline */}
        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-text-tertiary">
            © {year} {profile.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={toTop}
            className="nudge-icons group inline-flex min-h-11 items-center gap-2 self-start text-label text-text-tertiary transition-colors hover:text-text sm:self-auto"
          >
            <span className="link-underline">Back to top</span>
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </footer>
  )
}
