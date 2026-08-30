import { useState } from 'react'
import { Menu, ArrowUpRight } from 'lucide-react'
import { Logo, ThemeToggle } from '@/components/shared'
import { Container } from '@/components/layout'
import { IconButton, Button } from '@/components/ui'
import { NavLink } from './NavLink'
import { MobileMenu } from './MobileMenu'
import { PRIMARY_NAV } from '@/constants/nav-links'
import { ROUTES } from '@/constants/routes'
import { profile } from '@/data/profile'
import { useScrolled } from '@/hooks/useScrollPosition'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function Navbar() {
  const scrolled = useScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-200 ease-out',
        scrolled ? 'border-b border-border bg-bg/85 backdrop-blur-sm' : 'border-b border-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <NavLink key={item.href} label={item.label} href={item.href} />
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-body-sm font-medium text-text-secondary transition-colors hover:text-text"
              >
                GitHub
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-body-sm font-medium text-text-secondary transition-colors hover:text-text"
              >
                LinkedIn
              </a>
            )}
            <Button asChild size="sm" variant="secondary">
              <Link to={ROUTES.resume}>
                Resume
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <IconButton aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  )
}
