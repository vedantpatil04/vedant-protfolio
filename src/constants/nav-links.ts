import { ROUTES } from './routes'

export interface NavLinkItem {
  label: string
  href: string
}

/** Primary in-app navigation, left-aligned in the navbar. */
export const PRIMARY_NAV: NavLinkItem[] = [
  { label: 'Work', href: ROUTES.projects },
  { label: 'About', href: ROUTES.about },
  { label: 'Certificates', href: ROUTES.certificates },
  { label: 'Journey', href: ROUTES.journey },
]

export interface NavExternalLink {
  label: string
  href: string
}

/** Right-aligned utility links in the navbar — resolved from profile data. */
export const NAV_UTILITY_KEYS = ['resume', 'github', 'linkedin'] as const
