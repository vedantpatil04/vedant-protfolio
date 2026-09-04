import type { Profile } from '@/types'

/**
 * Centralized developer identity. Every component that needs the
 * owner's name, title or social links should read from here rather
 * than hardcoding strings — this is the single edit point for Phase 2+.
 *
 * Unknown values are left as empty strings / placeholders rather than
 * invented. Fill these in before shipping.
 */
export const profile: Profile = {
  name: 'Vedant Patil',
  title: 'Full-Stack Developer',
  tagline: 'Building full-stack products end to end — React on the front, Node on the back.',
  location: '', // TODO: add city/region
  github: '', // TODO: add GitHub profile URL
  linkedin: '', // TODO: add LinkedIn profile URL
  email: '', // TODO: add contact email
  resume: '', // TODO: add resume file URL
  availability: undefined,
}

/**
 * Empty, typed placeholder — ready to be populated with real content
 * in a later phase. Certificates, Achievements, Skills, Education, and
 * Journey now come from the live API (see useCertificates/useAchievements/
 * useSkills/useEducation/useJourney) rather than this file, since their
 * backend + (partial) admin CRUD already exist.
 */
export const experience: import('@/types').Experience[] = []
