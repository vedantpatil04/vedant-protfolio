import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminJourney, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Textarea, Select, Switch, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import { JOURNEY_CATEGORIES, type JourneyEntry, type JourneyCategory } from '@/types'
import { JOURNEY_CATEGORY_LABELS } from '@/constants/content-labels'
import { ROUTES } from '@/constants/routes'

interface JourneyFormValues {
  title: string
  description: string
  date: string
  category: JourneyCategory
  organization: string
  featured: boolean
}

const EMPTY_FORM: JourneyFormValues = {
  title: '',
  description: '',
  date: '',
  category: 'milestone',
  organization: '',
  featured: false,
}

function toFormValues(entry: JourneyEntry): JourneyFormValues {
  return {
    title: entry.title,
    description: entry.description,
    date: entry.date ? entry.date.slice(0, 10) : '',
    category: entry.category ?? 'milestone',
    organization: entry.organization ?? '',
    featured: entry.featured,
  }
}

function validate(values: JourneyFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.description.trim()) errors.description = 'Description is required.'
  if (!values.date) errors.date = 'Date is required.'
  return errors
}

export default function JourneyForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  usePageTitle(isEdit ? 'Admin — Edit Journey Entry' : 'Admin — Add Journey Entry')
  const { items, loading, create, update, mutating } = useAdminJourney()

  const existing = useMemo(() => (isEdit ? items.find((j) => j.id === id) : undefined), [items, isEdit, id])

  if (isEdit && loading) {
    return <Loading label="Loading journey entry" />
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Journey entry not found" />
        <Button asChild variant="outline" className="w-fit">
          <Link to={ROUTES.adminJourney}>Back to journey</Link>
        </Button>
      </div>
    )
  }

  return (
    <JourneyFormBody
      key={id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      create={create}
      update={update}
      mutating={mutating}
    />
  )
}

interface JourneyFormBodyProps {
  isEdit: boolean
  existing?: JourneyEntry
  create: (input: Partial<JourneyEntry>) => Promise<JourneyEntry>
  update: (id: string, input: Partial<JourneyEntry>) => Promise<JourneyEntry>
  mutating: boolean
}

function JourneyFormBody({ isEdit, existing, create, update, mutating }: JourneyFormBodyProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<JourneyFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof JourneyFormValues>(key: K, value: JourneyFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<JourneyEntry> = {
      title: values.title,
      description: values.description,
      date: values.date,
      category: values.category,
      organization: values.organization || undefined,
      featured: values.featured,
    }

    try {
      if (isEdit && existing) {
        await update(existing.id, payload)
      } else {
        await create(payload)
      }
      setDirty(false)
      navigate(ROUTES.adminJourney)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={isEdit ? 'Edit journey entry' : 'Add journey entry'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Basic Information">
          <FormField id="title" label="Title" required error={errors.title}>
            <Input id="title" value={values.title} onChange={(e) => setField('title', e.target.value)} />
          </FormField>
          <FormField id="organization" label="Organization" helperText="Optional">
            <Input id="organization" value={values.organization} onChange={(e) => setField('organization', e.target.value)} />
          </FormField>
          <FormField id="category" label="Category">
            <Select id="category" value={values.category} onChange={(e) => setField('category', e.target.value as JourneyCategory)}>
              {JOURNEY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {JOURNEY_CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="date" label="Date" required error={errors.date}>
            <Input id="date" type="date" value={values.date} onChange={(e) => setField('date', e.target.value)} />
          </FormField>
          <FormField id="description" label="Description" required error={errors.description} className="sm:col-span-2">
            <Textarea id="description" rows={3} value={values.description} onChange={(e) => setField('description', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Publishing">
          <FormField id="featured" label="Current focus" helperText="Surfaced separately as the current focus on the public timeline.">
            <Switch id="featured" checked={values.featured} onChange={(e) => setField('featured', e.target.checked)} label="This is my current focus" />
          </FormField>
        </FormSection>

        {serverError && (
          <p role="alert" className="text-body-sm text-red-500">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <Button type="submit" loading={mutating}>
            {isEdit ? 'Save changes' : 'Create entry'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.adminJourney}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
