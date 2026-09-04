import { type FormEvent, useState, useRef } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Section, TwoColumn } from '@/components/layout'
import { SectionHeader, Input, Textarea, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useToast } from '@/hooks/useToast'
import { profile } from '@/data/profile'
import { messageService } from '@/services'

export function ContactSection() {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    if (!name || !email || !message) {
      toast({
        variant: 'error',
        title: 'Missing information',
        description: 'Please fill in your name, email, and message.',
      })
      return
    }

    try {
      setSubmitting(true)
      await messageService.send({ name, email, message })
      setSentSuccess(true)
      formRef.current.reset()
      toast({
        variant: 'success',
        title: 'Message sent successfully!',
        description: "Thanks for reaching out! I'll get back to you as soon as possible.",
      })
    } catch (err) {
      console.error('[contact] Failed to send message:', err)
      toast({
        variant: 'error',
        title: 'Could not send message',
        description: err instanceof Error ? err.message : 'Please try again later or reach out via email directly.',
      })
    } finally {
      setSubmitting(false)
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
                  Have a project in mind or just want to talk shop? Reach out below.
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
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                {sentSuccess && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-body-sm text-text-primary">
                    <CheckCircle2 className="size-4 shrink-0 text-success" />
                    <span>Your message has been sent. Thank you!</span>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-label text-text-tertiary">
                      Name
                    </label>
                    <Input id="contact-name" name="name" required autoComplete="name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-label text-text-tertiary">
                      Email
                    </label>
                    <Input id="contact-email" name="email" type="email" required autoComplete="email" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="text-label text-text-tertiary">
                    Message
                  </label>
                  <Textarea id="contact-message" name="message" required />
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
