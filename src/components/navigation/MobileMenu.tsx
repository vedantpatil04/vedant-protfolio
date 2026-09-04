import { Code2, Briefcase } from 'lucide-react'
import { Drawer } from '@/components/ui'
import { NavLink } from './NavLink'
import { PRIMARY_NAV } from '@/constants/nav-links'
import { profile } from '@/data/profile'
import { Button } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { Link } from 'react-router-dom'

export interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const close = () => onOpenChange(false)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Menu">
      <nav className="flex flex-col gap-1">
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            href={item.href}
            onClick={close}
            className="py-3 text-body"
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4 pt-8">
        <Button asChild variant="secondary" onClick={close} className="min-h-[44px] w-full justify-center">
          <Link to={ROUTES.resume}>Resume</Link>
        </Button>
        <div className="flex items-center gap-2">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-2 hover:text-accent"
            >
              <Code2 className="size-5" aria-hidden="true" />
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-2 hover:text-accent"
            >
              <Briefcase className="size-5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </Drawer>
  )
}
