import { type FormEvent, type ReactNode, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, Input, Textarea, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useToast } from '@/hooks/useToast'
import { profile } from '@/data/profile'
import { messageService } from '@/services'
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion'
import { cn } from '@/lib/utils'

type FieldName = 'name' | 'email' | 'message'
type FieldErrors = Partial<Record<FieldName, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Client-side checks only — mirrors what the form already required; the API remains the source of truth. */
function validate(values: Record<FieldName, string>): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name) errors.name = 'Please add your name.'
  if (!values.email) errors.email = 'Please add an email so I can reply.'
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'That email doesn’t look quite right.'
  if (!values.message) errors.message = 'Please write a short message.'
  return errors
}

export interface ContactSectionProps {
  /** Rendered as the /contact page: h1 title and page-top spacing instead of a numbered homepage chapter. */
  asPage?: boolean
}

/**
 * UI/UX only — the submission path (messageService.send → POST
 * /api/messages) and the toast feedback are unchanged. Phase 10 adds
 * inline, field-level errors (announced via aria-describedby), a clear
 * inline error banner on failure, and a success state that replaces the
 * form until the visitor chooses to send another message.
 */
export function ContactSection({ asPage = false }: ContactSectionProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const clearFieldError = (field: FieldName) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const values = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    }

    const errors = validate(values)
    setFieldErrors(errors)
    setSubmitError(null)
    const firstInvalid = (Object.keys(errors) as FieldName[])[0]
    if (firstInvalid) {
      formRef.current.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      toast({
        variant: 'error',
        title: 'Missing information',
        description: 'Please fill in your name, email, and message.',
      })
      return
    }

    try {
      setSubmitting(true)
      await messageService.send(values)
      setSentSuccess(true)
      formRef.current?.reset()
      toast({
        variant: 'success',
        title: 'Message sent successfully!',
        description: "Thanks for reaching out! I'll get back to you as soon as possible.",
      })
    } catch (err) {
      console.error('[contact] Failed to send message:', err)
      const description = err instanceof Error ? err.message : 'Please try again later or reach out via email directly.'
      setSubmitError(description)
      toast({ variant: 'error', title: 'Could not send message', description })
    } finally {
      setSubmitting(false)
    }
  }

  const channels = [
    profile.email && { label: profile.email, kind: 'Email', href: `mailto:${profile.email}` },
    profile.github && { label: profile.github.replace(/^https?:\/\/(www\.)?/, ''), kind: 'GitHub', href: profile.github },
    profile.linkedin && { label: 'LinkedIn', kind: 'LinkedIn', href: profile.linkedin },
  ].filter(Boolean) as { label: string; kind: string; href: string }[]

  return (
    <Section id="contact" className={cn(asPage && 'min-h-[70vh] pt-12 sm:pt-16 lg:pt-20')}>
      <Reveal>
        <SectionHeader
          index={asPage ? undefined : 9}
          rule={asPage ? false : undefined}
          titleAs={asPage ? 'h1' : 'h2'}
          eyebrow="Say hello"
          title="Contact"
          description="Have a project in mind, or just want to talk shop? Send a message."
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-10">
        {/* Direct channels */}
        <Reveal className="lg:col-span-4">
          <div className="flex flex-col gap-6">
            <p className="max-w-[36ch] text-body text-text-secondary">
              The form is the quickest way to reach me. Prefer something else?
            </p>
            {channels.length > 0 && (
              <ul>
                {channels.map((channel) => {
                  const isHttp = channel.href.startsWith('http')
                  return (
                    <li key={channel.kind} className="border-b border-border first:border-t">
                      <a
                        href={channel.href}
                        target={isHttp ? '_blank' : undefined}
                        rel={isHttp ? 'noreferrer' : undefined}
                        className="nudge-icons group flex items-center justify-between gap-4 py-4"
                      >
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-label text-text-tertiary">{channel.kind}</span>
                          <span className="truncate text-body-sm font-medium text-text transition-colors group-hover:text-accent">
                            {channel.label}
                          </span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-text-tertiary group-hover:text-accent" aria-hidden="true" />
                        {isHttp && <span className="sr-only">(opens in a new tab)</span>}
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </Reveal>

        {/* Form / success */}
        <Reveal delay={0.06} className="lg:col-span-7 lg:col-start-6">
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {sentSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: DURATION.fast } }}
                  className="flex flex-col items-start gap-5 border-t border-border pt-8"
                >
                  <span className="flex size-12 items-center justify-center rounded-full border border-success/40 text-success">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                      <motion.path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, transition: { duration: 0.5, delay: 0.15, ease: EASE_OUT_EXPO } }}
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-display text-h3 text-text">Message sent — thank you.</p>
                    <p className="mt-2 max-w-[44ch] text-body text-text-secondary">
                      I’ll get back to you as soon as possible.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setSentSuccess(false)}>
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: DURATION.fast } }}
                  className="flex flex-col gap-6"
                >
                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-md border border-danger/40 bg-danger/5 px-4 py-3 text-body-sm text-text"
                    >
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
                      <div>
                        <p className="font-medium">Your message couldn’t be sent.</p>
                        <p className="mt-0.5 text-text-secondary">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field id="contact-name" label="Name" error={fieldErrors.name}>
                      <Input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        className="h-12"
                        error={fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                        onChange={() => clearFieldError('name')}
                      />
                    </Field>
                    <Field id="contact-email" label="Email" error={fieldErrors.email}>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        className="h-12"
                        error={fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                        onChange={() => clearFieldError('email')}
                      />
                    </Field>
                  </div>
                  <Field id="contact-message" label="Message" error={fieldErrors.message}>
                    <Textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={6}
                      className="min-h-40"
                      error={fieldErrors.message}
                      aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                      onChange={() => clearFieldError('message')}
                    />
                  </Field>

                  <div className="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-caption text-text-tertiary">All fields are required.</p>
                    <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
                      {submitting ? 'Sending…' : 'Send message'}
                      {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={cn('text-label transition-colors', error ? 'text-danger' : 'text-text-tertiary')}>
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="text-caption text-danger"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: DURATION.fast } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
