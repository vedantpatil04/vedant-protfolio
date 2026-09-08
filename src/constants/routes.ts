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

  adminProjects: '/admin/projects',
  adminProjectNew: '/admin/projects/new',
  adminProjectEdit: (id: string = ':id') => `/admin/projects/${id}/edit`,

  adminCertificates: '/admin/certificates',
  adminCertificateNew: '/admin/certificates/new',
  adminCertificateEdit: (id: string = ':id') => `/admin/certificates/${id}/edit`,

  adminAchievements: '/admin/achievements',
  adminAchievementNew: '/admin/achievements/new',
  adminAchievementEdit: (id: string = ':id') => `/admin/achievements/${id}/edit`,

  adminJourney: '/admin/journey',
  adminJourneyNew: '/admin/journey/new',
  adminJourneyEdit: (id: string = ':id') => `/admin/journey/${id}/edit`,

  adminSkills: '/admin/skills',
  adminSkillNew: '/admin/skills/new',
  adminSkillEdit: (id: string = ':id') => `/admin/skills/${id}/edit`,

  adminEducation: '/admin/education',
  adminEducationNew: '/admin/education/new',
  adminEducationEdit: (id: string = ':id') => `/admin/education/${id}/edit`,

  adminExperience: '/admin/experience',
  adminExperienceNew: '/admin/experience/new',
  adminExperienceEdit: (id: string = ':id') => `/admin/experience/${id}/edit`,

  adminSettings: '/admin/settings',
} as const
