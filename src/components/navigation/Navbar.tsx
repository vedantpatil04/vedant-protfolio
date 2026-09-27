import { useState } from 'react'
import { Menu, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo, ThemeToggle } from '@/components/shared'
import { Container } from '@/components/layout'
import { IconButton, Button } from '@/components/ui'
import { NavLink } from './NavLink'
import { MobileMenu, MOBILE_MENU_ID } from './MobileMenu'
import { PRIMARY_NAV } from '@/constants/nav-links'
import { ROUTES } from '@/constants/routes'
import { profile } from '@/data/profile'
import { useScrolled } from '@/hooks/useScrollPosition'
import { cn } from '@/lib/utils'

/**
 * Minimal sticky bar. Transparent over the hero, then a quiet blurred
 * surface + hairline once the page scrolls — height never changes, so
 * nothing below shifts. External profile links only appear from lg up;
 * tablets and phones get the full-screen menu instead of a cramped bar.
 */
export function Navbar() {
  const scrolled = useScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)

  const external = [
    profile.github && { label: 'GitHub', href: profile.github },
    profile.linkedin && { label: 'LinkedIn', href: profile.linkedin },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ease-out',
        scrolled ? 'border-border bg-bg/80 backdrop-blur-md' : 'border-transparent bg-bg/0',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
          <Logo />

          <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <NavLink key={item.href} label={item.label} href={item.href} />
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {external.length > 0 && (
              <div className="mr-3 hidden items-center gap-5 lg:flex">
                {external.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="nudge-icons inline-flex items-center gap-1 text-body-sm font-medium text-text-secondary transition-colors hover:text-text"
                  >
                    <span className="link-underline">{link.label}</span>
                    <ArrowUpRight className="size-3.5 text-text-tertiary" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </div>
            )}
            <Button asChild size="sm" variant="secondary">
              <Link to={ROUTES.resume}>
                Resume
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <IconButton
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls={MOBILE_MENU_ID}
              aria-haspopup="dialog"
              onClick={() => setMobileOpen(true)}
              className="size-11"
            >
              <Menu className="size-5" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  )
}
