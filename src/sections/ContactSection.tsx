import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Section, TwoColumn } from '@/components/layout'
import { SectionHeader, Input, Textarea, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useToast } from '@/hooks/useToast'
import { profile } from '@/data/profile'
import { messageService } from '@/services'
import { ApiError } from '@/services/api'
import { CONTACT_LIMITS, validateContactForm, type ContactFormErrors, type ContactFormValues } from '@/lib/contact-validation'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const INITIAL_VALUES: ContactFormValues = { name: '', email: '', subject: '', message: '' }

const GENERIC_ERROR_MESSAGE = 'Unable to send your message right now. Please try again later.'
const RATE_LIMITED_CODE = 'RATE_LIMITED'

export function ContactSection() {
  const { toast } = useToast()
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES)
  // Honeypot — kept in separate state (not part of ContactFormValues) so it
  // never runs through visitor-facing validation. A real visitor never sees
  // this field; see the off-screen wrapper below.
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const submitting = status === 'submitting'

  const handleChange =
    (field: keyof ContactFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setValues((prev) => ({ ...prev, [field]: value }))
      // Once the visitor is editing again, a stale success/error banner from
      // a previous submission is just confusing — clear it.
      setStatus((prev) => (prev === 'idle' || prev === 'submitting' ? prev : 'idle'))
    }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return // extra guard beyond the disabled button — no duplicate submits on repeated clicks

    const validationErrors = validateContactForm(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    try {
      setStatus('submitting')
      await messageService.send({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim() || undefined,
        message: values.message.trim(),
        website,
      })
      setStatus('success')
      setValues(INITIAL_VALUES)
      setErrors({})
      toast({
        variant: 'success',
        title: 'Message sent successfully!',
        description: "Thanks for reaching out! I'll get back to you as soon as possible.",
      })
    } catch (err) {
      setStatus('error')
      console.error('[contact] Failed to send message:', err)
      const description =
        err instanceof ApiError && err.code === RATE_LIMITED_CODE ? err.message : GENERIC_ERROR_MESSAGE
      toast({ variant: 'error', title: 'Could not send message', description })
    }
  }

  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Say hello" title="Contact" />
      </Reveal>
      <div className="mt-10">
        <Reveal delay={0.05}>
          <TwoColumn
            ratio="2-3"
            left={
              <div className="flex flex-col gap-4">
                <p className="text-body text-text-secondary">
                  Have a project, opportunity, collaboration, or question? Send a message below.
                </p>
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 text-body-sm font-medium text-accent hover:underline"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    {profile.email}
                  </a>
                )}
              </div>
            }
            right={
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {status === 'success' && (
                  <div
                    role="status"
                    className="flex items-center gap-2.5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-body-sm text-text-primary"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                    <span>Message sent. Thanks for reaching out — I'll get back to you as soon as possible.</span>
                  </div>
                )}

                {/* Honeypot — off-screen (not display:none/visibility:hidden, which
                    some bots detect and skip) rather than removed from the DOM, so
                    it's invisible and unreachable to a real visitor but still looks
                    like a normal field to a naive scraper. */}
                <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-label text-text-tertiary">
                      Name
                    </label>
                    <Input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      maxLength={CONTACT_LIMITS.nameMax}
                      value={values.name}
                      onChange={handleChange('name')}
                      error={errors.name}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      required
                    />
                    {errors.name && (
                      <p id="contact-name-error" role="alert" className="text-caption text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-label text-text-tertiary">
                      Email
                    </label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange('email')}
                      error={errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      required
                    />
                    {errors.email && (
                      <p id="contact-email-error" role="alert" className="text-caption text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-subject" className="text-label text-text-tertiary">
                    Subject <span className="text-text-tertiary/70">(optional)</span>
                  </label>
                  <Input
                    id="contact-subject"
                    name="subject"
                    autoComplete="off"
                    maxLength={CONTACT_LIMITS.subjectMax}
                    value={values.subject}
                    onChange={handleChange('subject')}
                    error={errors.subject}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" role="alert" className="text-caption text-red-500">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="text-label text-text-tertiary">
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    maxLength={CONTACT_LIMITS.messageMax}
                    value={values.message}
                    onChange={handleChange('message')}
                    error={errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    required
                  />
                  {errors.message && (
                    <p id="contact-message-error" role="alert" className="text-caption text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" loading={submitting} className="self-start">
                  Send message
                </Button>
              </form>
            }
          />
        </Reveal>
      </div>
    </Section>
  )
}
