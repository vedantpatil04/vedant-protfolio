/**
 * Frontend validation for the contact form. Mirrors the backend Zod
 * schema (server/src/types/validation.ts) by hand — same convention this
 * codebase already uses for types that shadow a backend shape. The
 * backend is the source of truth and re-validates independently; this
 * only exists to give the visitor fast, specific feedback before a
 * round trip.
 */

export const CONTACT_LIMITS = {
  nameMax: 120,
  subjectMax: 200,
  messageMin: 10,
  messageMax: 5000,
} as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactFormValues {
  name: string
  email: string
  subject: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

/** Returns an error per invalid field; a field with no error is omitted (not set to undefined). */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = 'Name is required.'
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Name must be ${CONTACT_LIMITS.nameMax} characters or fewer.`
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  const subject = values.subject.trim()
  if (subject.length > CONTACT_LIMITS.subjectMax) {
    errors.subject = `Subject must be ${CONTACT_LIMITS.subjectMax} characters or fewer.`
  }

  const message = values.message.trim()
  if (!message) {
    errors.message = 'Message is required.'
  } else if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`
  } else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Message must be ${CONTACT_LIMITS.messageMax} characters or fewer.`
  }

  return errors
}
