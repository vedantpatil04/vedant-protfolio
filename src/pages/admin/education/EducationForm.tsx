import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminEducation, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Textarea, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import type { Education } from '@/types'
import { ROUTES } from '@/constants/routes'

interface EducationFormValues {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  grade: string
  description: string
}

const EMPTY_FORM: EducationFormValues = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  grade: '',
  description: '',
}

function toFormValues(item: Education): EducationFormValues {
  return {
    institution: item.institution,
    degree: item.degree,
    field: item.field ?? '',
    startDate: item.startDate ? item.startDate.slice(0, 10) : '',
    endDate: item.endDate ? item.endDate.slice(0, 10) : '',
    grade: item.grade ?? '',
    description: item.description ?? '',
  }
}

function validate(values: EducationFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.institution.trim()) errors.institution = 'Institution is required.'
  if (!values.degree.trim()) errors.degree = 'Degree is required.'
  if (!values.startDate) errors.startDate = 'Start date is required.'
  return errors
}

export default function EducationForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  usePageTitle(isEdit ? 'Admin — Edit Education' : 'Admin — Add Education')
  const { items, loading, create, update, mutating } = useAdminEducation()

  const existing = useMemo(() => (isEdit ? items.find((e) => e.id === id) : undefined), [items, isEdit, id])

  if (isEdit && loading) {
    return <Loading label="Loading education entry" />
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Education entry not found" />
        <Button asChild variant="outline" className="w-fit">
          <Link to={ROUTES.adminEducation}>Back to education</Link>
        </Button>
      </div>
    )
  }

  return (
    <EducationFormBody
      key={id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      create={create}
      update={update}
      mutating={mutating}
    />
  )
}

interface EducationFormBodyProps {
  isEdit: boolean
  existing?: Education
  create: (input: Partial<Education>) => Promise<Education>
  update: (id: string, input: Partial<Education>) => Promise<Education>
  mutating: boolean
}

function EducationFormBody({ isEdit, existing, create, update, mutating }: EducationFormBodyProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<EducationFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof EducationFormValues>(key: K, value: EducationFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<Education> = {
      institution: values.institution,
      degree: values.degree,
      field: values.field || undefined,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      grade: values.grade || undefined,
      description: values.description || undefined,
    }

    try {
      if (isEdit && existing) {
        await update(existing.id, payload)
      } else {
        await create(payload)
      }
      setDirty(false)
      navigate(ROUTES.adminEducation)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={isEdit ? 'Edit education' : 'Add education'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Basic Information">
          <FormField id="institution" label="Institution" required error={errors.institution}>
            <Input id="institution" value={values.institution} onChange={(e) => setField('institution', e.target.value)} />
          </FormField>
          <FormField id="degree" label="Degree" required error={errors.degree}>
            <Input id="degree" value={values.degree} onChange={(e) => setField('degree', e.target.value)} />
          </FormField>
          <FormField id="field" label="Field of study" helperText="Optional">
            <Input id="field" value={values.field} onChange={(e) => setField('field', e.target.value)} />
          </FormField>
          <FormField id="grade" label="Grade" helperText="Optional">
            <Input id="grade" value={values.grade} onChange={(e) => setField('grade', e.target.value)} />
          </FormField>
          <FormField id="startDate" label="Start date" required error={errors.startDate}>
            <Input id="startDate" type="date" value={values.startDate} onChange={(e) => setField('startDate', e.target.value)} />
          </FormField>
          <FormField id="endDate" label="End date" helperText="Leave blank if ongoing">
            <Input id="endDate" type="date" value={values.endDate} onChange={(e) => setField('endDate', e.target.value)} />
          </FormField>
          <FormField id="description" label="Description" className="sm:col-span-2" helperText="Optional">
            <Textarea id="description" rows={3} value={values.description} onChange={(e) => setField('description', e.target.value)} />
          </FormField>
        </FormSection>

        {serverError && (
          <p role="alert" className="text-body-sm text-red-500">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <Button type="submit" loading={mutating}>
            {isEdit ? 'Save changes' : 'Create education'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.adminEducation}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
