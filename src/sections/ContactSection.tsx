import { type FormEvent, useState } from 'react'
import { Mail } from 'lucide-react'
import { Section, TwoColumn } from '@/components/layout'
import { SectionHeader, Input, Textarea, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useToast } from '@/hooks/useToast'
import { profile } from '@/data/profile'

export function ContactSection() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    // No backend wired up in Phase 1 — this is the UI shell only.
    window.setTimeout(() => {
      setSubmitting(false)
      toast({
        variant: 'default',
        title: "Contact form isn't connected yet",
        description: 'Message sending will be wired up once the backend lands.',
      })
    }, 500)
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
