import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminAchievements, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Textarea, Select, Switch, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import { ACHIEVEMENT_CATEGORIES, type Achievement, type AchievementCategory } from '@/types'
import { ACHIEVEMENT_CATEGORY_LABELS } from '@/constants/content-labels'
import { ROUTES } from '@/constants/routes'

interface AchievementFormValues {
  title: string
  description: string
  category: AchievementCategory
  date: string
  organization: string
  imageUrl: string
  url: string
  featured: boolean
}

const EMPTY_FORM: AchievementFormValues = {
  title: '',
  description: '',
  category: 'other',
  date: '',
  organization: '',
  imageUrl: '',
  url: '',
  featured: false,
}

function toFormValues(item: Achievement): AchievementFormValues {
  return {
    title: item.title,
    description: item.description,
    category: item.category ?? 'other',
    date: item.date ? item.date.slice(0, 10) : '',
    organization: item.organization ?? '',
    imageUrl: item.imageUrl ?? '',
    url: item.url ?? '',
    featured: item.featured,
  }
}

const URL_PATTERN = /^https?:\/\/.+/i

function validate(values: AchievementFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.description.trim()) errors.description = 'Description is required.'
  if (!values.date) errors.date = 'Date is required.'
  if (values.imageUrl && !URL_PATTERN.test(values.imageUrl)) errors.imageUrl = 'Enter a full URL (https://…).'
  if (values.url && !URL_PATTERN.test(values.url)) errors.url = 'Enter a full URL (https://…).'
  return errors
}

export default function AchievementForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  usePageTitle(isEdit ? 'Admin — Edit Achievement' : 'Admin — Add Achievement')
  const { items, loading, create, update, mutating } = useAdminAchievements()

  const existing = useMemo(() => (isEdit ? items.find((a) => a.id === id) : undefined), [items, isEdit, id])

  if (isEdit && loading) {
    return <Loading label="Loading achievement" />
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Achievement not found" />
        <Button asChild variant="outline" className="w-fit">
          <Link to={ROUTES.adminAchievements}>Back to achievements</Link>
        </Button>
      </div>
    )
  }

  return (
    <AchievementFormBody
      key={id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      create={create}
      update={update}
      mutating={mutating}
    />
  )
}

interface AchievementFormBodyProps {
  isEdit: boolean
  existing?: Achievement
  create: (input: Partial<Achievement>) => Promise<Achievement>
  update: (id: string, input: Partial<Achievement>) => Promise<Achievement>
  mutating: boolean
}

function AchievementFormBody({ isEdit, existing, create, update, mutating }: AchievementFormBodyProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<AchievementFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof AchievementFormValues>(key: K, value: AchievementFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<Achievement> = {
      title: values.title,
      description: values.description,
      category: values.category,
      date: values.date,
      organization: values.organization || undefined,
      imageUrl: values.imageUrl || undefined,
      url: values.url || undefined,
      featured: values.featured,
    }

    try {
      if (isEdit && existing) {
        await update(existing.id, payload)
      } else {
        await create(payload)
      }
      setDirty(false)
      navigate(ROUTES.adminAchievements)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={isEdit ? 'Edit achievement' : 'Add achievement'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Basic Information">
          <FormField id="title" label="Title" required error={errors.title}>
            <Input id="title" value={values.title} onChange={(e) => setField('title', e.target.value)} />
          </FormField>
          <FormField id="organization" label="Organization" helperText="Optional">
            <Input id="organization" value={values.organization} onChange={(e) => setField('organization', e.target.value)} />
          </FormField>
          <FormField id="category" label="Category">
            <Select id="category" value={values.category} onChange={(e) => setField('category', e.target.value as AchievementCategory)}>
              {ACHIEVEMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {ACHIEVEMENT_CATEGORY_LABELS[c]}
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

        <FormSection title="Links & Media">
          <FormField id="url" label="URL" error={errors.url} helperText="Optional">
            <Input id="url" value={values.url} onChange={(e) => setField('url', e.target.value)} />
          </FormField>
          <FormField id="imageUrl" label="Image URL" error={errors.imageUrl} helperText="Optional">
            <Input id="imageUrl" value={values.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Publishing">
          <FormField id="featured" label="Featured">
            <Switch
              id="featured"
              checked={values.featured}
              onChange={(e) => setField('featured', e.target.checked)}
              label="Show in featured achievements"
            />
          </FormField>
        </FormSection>

        {serverError && (
          <p role="alert" className="text-body-sm text-red-500">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <Button type="submit" loading={mutating}>
            {isEdit ? 'Save changes' : 'Create achievement'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.adminAchievements}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
