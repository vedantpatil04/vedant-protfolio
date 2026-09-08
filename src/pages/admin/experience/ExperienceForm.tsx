import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminExperience, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Textarea, TagInput, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import type { Experience } from '@/types'
import { ROUTES } from '@/constants/routes'

interface ExperienceFormValues {
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
  url: string
}

const EMPTY_FORM: ExperienceFormValues = {
  organization: '',
  role: '',
  startDate: '',
  endDate: '',
  description: '',
  technologies: [],
  url: '',
}

function toFormValues(item: Experience): ExperienceFormValues {
  return {
    organization: item.organization,
    role: item.role,
    startDate: item.startDate ? item.startDate.slice(0, 10) : '',
    endDate: item.endDate ? item.endDate.slice(0, 10) : '',
    description: item.description ?? '',
    technologies: item.technologies ?? [],
    url: item.url ?? '',
  }
}

const URL_PATTERN = /^https?:\/\/.+/i

function validate(values: ExperienceFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.organization.trim()) errors.organization = 'Organization is required.'
  if (!values.role.trim()) errors.role = 'Role is required.'
  if (!values.startDate) errors.startDate = 'Start date is required.'
  if (values.url && !URL_PATTERN.test(values.url)) errors.url = 'Enter a full URL (https://…).'
  return errors
}

export default function ExperienceForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  usePageTitle(isEdit ? 'Admin — Edit Experience' : 'Admin — Add Experience')
  const { items, loading, create, update, mutating } = useAdminExperience()

  const existing = useMemo(() => (isEdit ? items.find((e) => e.id === id) : undefined), [items, isEdit, id])

  if (isEdit && loading) {
    return <Loading label="Loading experience entry" />
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Experience entry not found" />
        <Button asChild variant="outline" className="w-fit">
          <Link to={ROUTES.adminExperience}>Back to experience</Link>
        </Button>
      </div>
    )
  }

  return (
    <ExperienceFormBody
      key={id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      create={create}
      update={update}
      mutating={mutating}
    />
  )
}

interface ExperienceFormBodyProps {
  isEdit: boolean
  existing?: Experience
  create: (input: Partial<Experience>) => Promise<Experience>
  update: (id: string, input: Partial<Experience>) => Promise<Experience>
  mutating: boolean
}

function ExperienceFormBody({ isEdit, existing, create, update, mutating }: ExperienceFormBodyProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<ExperienceFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof ExperienceFormValues>(key: K, value: ExperienceFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<Experience> = {
      organization: values.organization,
      role: values.role,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      description: values.description || undefined,
      technologies: values.technologies,
      url: values.url || undefined,
    }

    try {
      if (isEdit && existing) {
        await update(existing.id, payload)
      } else {
        await create(payload)
      }
      setDirty(false)
      navigate(ROUTES.adminExperience)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={isEdit ? 'Edit experience' : 'Add experience'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Basic Information">
          <FormField id="organization" label="Organization" required error={errors.organization}>
            <Input id="organization" value={values.organization} onChange={(e) => setField('organization', e.target.value)} />
          </FormField>
          <FormField id="role" label="Role" required error={errors.role}>
            <Input id="role" value={values.role} onChange={(e) => setField('role', e.target.value)} />
          </FormField>
          <FormField id="startDate" label="Start date" required error={errors.startDate}>
            <Input id="startDate" type="date" value={values.startDate} onChange={(e) => setField('startDate', e.target.value)} />
          </FormField>
          <FormField id="endDate" label="End date" helperText="Leave blank if ongoing">
            <Input id="endDate" type="date" value={values.endDate} onChange={(e) => setField('endDate', e.target.value)} />
          </FormField>
          <FormField id="url" label="URL" error={errors.url} helperText="Optional">
            <Input id="url" value={values.url} onChange={(e) => setField('url', e.target.value)} />
          </FormField>
          <FormField id="description" label="Description" className="sm:col-span-2" helperText="Optional">
            <Textarea id="description" rows={3} value={values.description} onChange={(e) => setField('description', e.target.value)} />
          </FormField>
          <FormField id="technologies" label="Technologies" className="sm:col-span-2">
            <TagInput id="technologies" values={values.technologies} onChange={(v) => setField('technologies', v)} />
          </FormField>
        </FormSection>

        {serverError && (
          <p role="alert" className="text-body-sm text-red-500">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <Button type="submit" loading={mutating}>
            {isEdit ? 'Save changes' : 'Create experience'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.adminExperience}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
