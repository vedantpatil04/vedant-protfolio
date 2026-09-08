import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminSkills, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Select, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import { SKILL_LEVELS, type Skill, type SkillCategory, type SkillLevel } from '@/types'
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_ORDER, SKILL_LEVEL_LABELS } from '@/constants/skills'
import { ROUTES } from '@/constants/routes'

interface SkillFormValues {
  name: string
  category: SkillCategory
  level: SkillLevel | ''
  icon: string
}

const EMPTY_FORM: SkillFormValues = {
  name: '',
  category: 'other',
  level: '',
  icon: '',
}

function toFormValues(skill: Skill): SkillFormValues {
  return {
    name: skill.name,
    category: skill.category,
    level: skill.level ?? '',
    icon: skill.icon ?? '',
  }
}

function validate(values: SkillFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  return errors
}

export default function SkillForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  usePageTitle(isEdit ? 'Admin — Edit Skill' : 'Admin — Add Skill')
  const { items, loading, create, update, mutating } = useAdminSkills()

  const existing = useMemo(() => (isEdit ? items.find((s) => s.id === id) : undefined), [items, isEdit, id])

  if (isEdit && loading) {
    return <Loading label="Loading skill" />
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Skill not found" />
        <Button asChild variant="outline" className="w-fit">
          <Link to={ROUTES.adminSkills}>Back to skills</Link>
        </Button>
      </div>
    )
  }

  return (
    <SkillFormBody
      key={id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      create={create}
      update={update}
      mutating={mutating}
    />
  )
}

interface SkillFormBodyProps {
  isEdit: boolean
  existing?: Skill
  create: (input: Partial<Skill>) => Promise<Skill>
  update: (id: string, input: Partial<Skill>) => Promise<Skill>
  mutating: boolean
}

function SkillFormBody({ isEdit, existing, create, update, mutating }: SkillFormBodyProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<SkillFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof SkillFormValues>(key: K, value: SkillFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<Skill> = {
      name: values.name,
      category: values.category,
      level: values.level || undefined,
      icon: values.icon || undefined,
    }

    try {
      if (isEdit && existing) {
        await update(existing.id, payload)
      } else {
        await create(payload)
      }
      setDirty(false)
      navigate(ROUTES.adminSkills)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={isEdit ? 'Edit skill' : 'Add skill'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Basic Information">
          <FormField id="name" label="Name" required error={errors.name}>
            <Input id="name" value={values.name} onChange={(e) => setField('name', e.target.value)} />
          </FormField>
          <FormField id="category" label="Category">
            <Select id="category" value={values.category} onChange={(e) => setField('category', e.target.value as SkillCategory)}>
              {SKILL_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {SKILL_CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="level" label="Level" helperText="Optional — shown qualitatively, never as a percentage.">
            <Select id="level" value={values.level} onChange={(e) => setField('level', e.target.value as SkillLevel | '')}>
              <option value="">Not set</option>
              {SKILL_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {SKILL_LEVEL_LABELS[l]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="icon" label="Icon" helperText="Optional icon identifier.">
            <Input id="icon" value={values.icon} onChange={(e) => setField('icon', e.target.value)} />
          </FormField>
        </FormSection>

        {serverError && (
          <p role="alert" className="text-body-sm text-red-500">
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <Button type="submit" loading={mutating}>
            {isEdit ? 'Save changes' : 'Create skill'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.adminSkills}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
