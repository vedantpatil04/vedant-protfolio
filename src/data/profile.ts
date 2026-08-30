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

/** Empty, typed placeholders — ready to be populated with real content in later phases. */
export const projects: import('@/types').Project[] = []
export const certificates: import('@/types').Certificate[] = []
export const achievements: import('@/types').Achievement[] = []
export const skills: import('@/types').Skill[] = []
export const education: import('@/types').Education[] = []
export const experience: import('@/types').Experience[] = []
