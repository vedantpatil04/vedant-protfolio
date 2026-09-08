import { useState, type FormEvent } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminSettings, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Textarea, Select, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import type { SiteSettings } from '@/services'

type Availability = NonNullable<SiteSettings['availability']> | ''

interface SettingsFormValues {
  name: string
  title: string
  bio: string
  location: string
  email: string
  githubUrl: string
  linkedinUrl: string
  leetcodeUrl: string
  resumeUrl: string
  profileImage: string
  availability: Availability
}

const EMPTY_FORM: SettingsFormValues = {
  name: '',
  title: '',
  bio: '',
  location: '',
  email: '',
  githubUrl: '',
  linkedinUrl: '',
  leetcodeUrl: '',
  resumeUrl: '',
  profileImage: '',
  availability: '',
}

function toFormValues(settings: SiteSettings): SettingsFormValues {
  return {
    name: settings.name ?? '',
    title: settings.title ?? '',
    bio: settings.bio ?? '',
    location: settings.location ?? '',
    email: settings.email ?? '',
    githubUrl: settings.githubUrl ?? '',
    linkedinUrl: settings.linkedinUrl ?? '',
    leetcodeUrl: settings.leetcodeUrl ?? '',
    resumeUrl: settings.resumeUrl ?? '',
    profileImage: settings.profileImage ?? '',
    availability: settings.availability ?? '',
  }
}

const URL_PATTERN = /^https?:\/\/.+/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: SettingsFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (values.email && !EMAIL_PATTERN.test(values.email)) errors.email = 'Enter a valid email address.'
  for (const field of ['githubUrl', 'linkedinUrl', 'leetcodeUrl', 'resumeUrl', 'profileImage'] as const) {
    if (values[field] && !URL_PATTERN.test(values[field])) {
      errors[field] = 'Enter a full URL (https://…).'
    }
  }
  return errors
}

export default function SettingsPage() {
  usePageTitle('Admin — Settings')
  const { settings, loading, save, saving } = useAdminSettings()

  if (loading) {
    return <Loading label="Loading settings" />
  }

  return <SettingsFormBody existing={settings ?? undefined} save={save} saving={saving} />
}

interface SettingsFormBodyProps {
  existing?: SiteSettings
  save: (input: Partial<SiteSettings>) => Promise<SiteSettings>
  saving: boolean
}

function SettingsFormBody({ existing, save, saving }: SettingsFormBodyProps) {
  const [values, setValues] = useState<SettingsFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<SiteSettings> = {
      name: values.name || undefined,
      title: values.title || undefined,
      bio: values.bio || undefined,
      location: values.location || undefined,
      email: values.email || undefined,
      githubUrl: values.githubUrl || undefined,
      linkedinUrl: values.linkedinUrl || undefined,
      leetcodeUrl: values.leetcodeUrl || undefined,
      resumeUrl: values.resumeUrl || undefined,
      profileImage: values.profileImage || undefined,
      availability: values.availability || undefined,
    }

    try {
      await save(payload)
      setDirty(false)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Site Settings" description="Profile-level information used across the public site." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Profile">
          <FormField id="name" label="Name">
            <Input id="name" value={values.name} onChange={(e) => setField('name', e.target.value)} />
          </FormField>
          <FormField id="title" label="Title" helperText="e.g. Full-Stack Developer">
            <Input id="title" value={values.title} onChange={(e) => setField('title', e.target.value)} />
          </FormField>
          <FormField id="location" label="Location">
            <Input id="location" value={values.location} onChange={(e) => setField('location', e.target.value)} />
          </FormField>
          <FormField id="email" label="Email" error={errors.email}>
            <Input id="email" type="email" value={values.email} onChange={(e) => setField('email', e.target.value)} />
          </FormField>
          <FormField id="bio" label="Bio" className="sm:col-span-2">
            <Textarea id="bio" rows={4} value={values.bio} onChange={(e) => setField('bio', e.target.value)} />
          </FormField>
          <FormField id="availability" label="Availability">
            <Select id="availability" value={values.availability} onChange={(e) => setField('availability', e.target.value as Availability)}>
              <option value="">Not set</option>
              <option value="open-to-work">Open to work</option>
              <option value="open-to-freelance">Open to freelance</option>
              <option value="not-available">Not available</option>
            </Select>
          </FormField>
        </FormSection>

        <FormSection title="Links">
          <FormField id="githubUrl" label="GitHub URL" error={errors.githubUrl}>
            <Input id="githubUrl" value={values.githubUrl} onChange={(e) => setField('githubUrl', e.target.value)} />
          </FormField>
          <FormField id="linkedinUrl" label="LinkedIn URL" error={errors.linkedinUrl}>
            <Input id="linkedinUrl" value={values.linkedinUrl} onChange={(e) => setField('linkedinUrl', e.target.value)} />
          </FormField>
          <FormField id="leetcodeUrl" label="LeetCode URL" error={errors.leetcodeUrl} helperText="Leave blank until you have a real profile to link.">
            <Input id="leetcodeUrl" value={values.leetcodeUrl} onChange={(e) => setField('leetcodeUrl', e.target.value)} />
          </FormField>
          <FormField id="resumeUrl" label="Resume URL" error={errors.resumeUrl}>
            <Input id="resumeUrl" value={values.resumeUrl} onChange={(e) => setField('resumeUrl', e.target.value)} />
          </FormField>
          <FormField id="profileImage" label="Profile image URL" error={errors.profileImage} className="sm:col-span-2">
            <Input id="profileImage" value={values.profileImage} onChange={(e) => setField('profileImage', e.target.value)} />
          </FormField>
        </FormSection>

        {serverError && (
          <p role="alert" className="text-body-sm text-red-500">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <Button type="submit" loading={saving}>
            Save settings
          </Button>
        </div>
      </form>
    </div>
  )
}
