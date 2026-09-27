import { useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { Link, NavLink as RouterNavLink } from 'react-router-dom'
import { PRIMARY_NAV } from '@/constants/nav-links'
import { ROUTES } from '@/constants/routes'
import { profile } from '@/data/profile'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DURATION, EASE_IN_OUT, EASE_OUT_EXPO, EASE_STANDARD } from '@/lib/motion'
import { cn } from '@/lib/utils'

export const MOBILE_MENU_ID = 'mobile-menu'

export interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const panel: Variants = {
  closed: { clipPath: 'inset(0% 0% 100% 0%)' },
  open: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.55, ease: EASE_IN_OUT } },
  exit: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.38, ease: EASE_IN_OUT } },
}

const list: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.045, delayChildren: 0.16 } },
}

const item: Variants = {
  closed: { opacity: 0, y: 22 },
  open: { opacity: 1, y: 0, transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO } },
}

/**
 * Full-screen mobile / tablet navigation. Built on Radix Dialog, so it
 * gets a focus trap, Escape-to-close, body scroll lock (no scroll bleed
 * behind the panel) and focus return to the trigger for free. The panel
 * wipes down with a clip transition; links rise in on a short stagger.
 * It closes on navigation and when the viewport grows past the md
 * breakpoint where the inline nav takes over.
 */
export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const close = () => onOpenChange(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (isDesktop && open) onOpenChange(false)
  }, [isDesktop, open, onOpenChange])

  const external = [
    profile.github && { label: 'GitHub', href: profile.github },
    profile.linkedin && { label: 'LinkedIn', href: profile.linkedin },
    profile.email && { label: 'Email', href: `mailto:${profile.email}` },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Overlay carries Radix's scroll lock (RemoveScroll) — required even though the panel is opaque. */}
            <DialogPrimitive.Overlay forceMount className="fixed inset-0 z-50 bg-transparent" />
            <DialogPrimitive.Content
              forceMount
              asChild
              id={MOBILE_MENU_ID}
              aria-describedby={undefined}
              onCloseAutoFocus={(event) => {
                // Radix returns focus to the trigger; don't let that scroll the page.
                event.preventDefault()
                document.querySelector<HTMLButtonElement>(`[aria-controls="${MOBILE_MENU_ID}"]`)?.focus({
                  preventScroll: true,
                })
              }}
            >
              <motion.div
                className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-bg focus:outline-none"
                variants={panel}
                initial="closed"
                animate="open"
                exit="exit"
              >
                <DialogPrimitive.Title className="sr-only">Site menu</DialogPrimitive.Title>

                <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 xs:px-5 sm:h-[4.5rem] sm:px-8">
                  <span className="text-label text-text-tertiary">Menu</span>
                  <DialogPrimitive.Close
                    className="inline-flex size-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
                    aria-label="Close menu"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </DialogPrimitive.Close>
                </div>

                <motion.nav
                  aria-label="Primary"
                  className="flex flex-1 flex-col justify-center px-4 py-10 xs:px-5 sm:px-8"
                  variants={list}
                  initial="closed"
                  animate="open"
                >
                  <ul className="flex flex-col">
                    {PRIMARY_NAV.map((navItem, i) => (
                      <motion.li key={navItem.href} variants={item} className="border-b border-border first:border-t">
                        <RouterNavLink
                          to={navItem.href}
                          onClick={close}
                          className={({ isActive }) =>
                            cn(
                              'group flex items-baseline gap-4 py-4 transition-colors duration-200',
                              isActive ? 'text-accent' : 'text-text hover:text-accent',
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span className="text-label w-6 shrink-0 tabular text-text-tertiary">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span className="font-display text-[clamp(1.75rem,1.2rem+3.2vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em]">
                                {navItem.label}
                              </span>
                              {isActive && (
                                <span className="text-label ml-auto self-center text-accent">Current</span>
                              )}
                            </>
                          )}
                        </RouterNavLink>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>

                <motion.div
                  className="flex shrink-0 flex-col gap-5 border-t border-border px-4 pb-8 pt-6 xs:px-5 sm:px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.35, duration: DURATION.medium, ease: EASE_STANDARD } }}
                >
                  <Link
                    to={ROUTES.resume}
                    onClick={close}
                    className="nudge-icons inline-flex min-h-12 items-center justify-between rounded-md border border-border bg-surface px-4 text-body font-medium text-text transition-colors hover:border-border-strong"
                  >
                    Resume
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                  {external.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      {external.map((link) => {
                        const isHttp = link.href.startsWith('http')
                        return (
                          <a
                            key={link.label}
                            href={link.href}
                            target={isHttp ? '_blank' : undefined}
                            rel={isHttp ? 'noreferrer' : undefined}
                            className="nudge-icons inline-flex min-h-11 items-center gap-1.5 text-body-sm font-medium text-text-secondary transition-colors hover:text-text"
                          >
                            <span className="link-underline">{link.label}</span>
                            <ArrowUpRight className="size-3.5 text-text-tertiary" aria-hidden="true" />
                            {isHttp && <span className="sr-only">(opens in a new tab)</span>}
                          </a>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
