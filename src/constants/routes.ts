/**
 * Central route map. Import ROUTES rather than hardcoding path strings
 * throughout the app, so the route shell can evolve in one place.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  projects: '/projects',
  projectDetail: (slug: string = ':slug') => `/projects/${slug}`,
  certificates: '/certificates',
  certificateDetail: (id: string = ':id') => `/certificates/${id}`,
  achievements: '/achievements',
  journey: '/journey',
  contact: '/contact',
  resume: '/resume',
  adminLogin: '/admin/login',
  admin: '/admin',
} as const
