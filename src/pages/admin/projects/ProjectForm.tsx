import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminProjects, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Textarea, Select, Switch, TagInput, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import { PROJECT_STATUSES, type Project, type ProjectStatus } from '@/types'
import { PROJECT_STATUS_LABELS } from '@/constants/content-labels'
import { ROUTES } from '@/constants/routes'
import { slugify } from '@/lib/utils'

interface ProjectFormValues {
  title: string
  slug: string
  shortDescription: string
  description: string
  thumbnail: string
  gallery: string[]
  technologies: string[]
  githubUrl: string
  liveUrl: string
  featured: boolean
  problem: string
  solution: string
  architecture: string
  features: string[]
  challenges: string[]
  outcome: string
  status: ProjectStatus
}

const EMPTY_FORM: ProjectFormValues = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  thumbnail: '',
  gallery: [],
  technologies: [],
  githubUrl: '',
  liveUrl: '',
  featured: false,
  problem: '',
  solution: '',
  architecture: '',
  features: [],
  challenges: [],
  outcome: '',
  status: 'draft',
}

function toFormValues(project: Project): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    description: project.description,
    thumbnail: project.thumbnail ?? '',
    gallery: project.gallery ?? [],
    technologies: project.technologies ?? [],
    githubUrl: project.githubUrl ?? '',
    liveUrl: project.liveUrl ?? '',
    featured: project.featured,
    problem: project.problem ?? '',
    solution: project.solution ?? '',
    architecture: project.architecture ?? '',
    features: project.features ?? [],
    challenges: project.challenges ?? [],
    outcome: project.outcome ?? '',
    status: project.status,
  }
}

const URL_PATTERN = /^https?:\/\/.+/i
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

function validate(values: ProjectFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.slug.trim()) errors.slug = 'Slug is required.'
  else if (!SLUG_PATTERN.test(values.slug)) {
    errors.slug = 'Use lowercase letters, numbers and hyphens only (e.g. my-project).'
  }
  if (!values.shortDescription.trim()) errors.shortDescription = 'Short description is required.'
  if (!values.description.trim()) errors.description = 'Description is required.'
  if (values.githubUrl && !URL_PATTERN.test(values.githubUrl)) errors.githubUrl = 'Enter a full URL (https://…).'
  if (values.liveUrl && !URL_PATTERN.test(values.liveUrl)) errors.liveUrl = 'Enter a full URL (https://…).'
  if (values.thumbnail && !URL_PATTERN.test(values.thumbnail)) errors.thumbnail = 'Enter a full URL (https://…).'
  return errors
}

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  usePageTitle(isEdit ? 'Admin — Edit Project' : 'Admin — Add Project')
  const { items, loading, create, update, mutating } = useAdminProjects()

  const existing = useMemo(() => (isEdit ? items.find((p) => p.id === id) : undefined), [items, isEdit, id])

  if (isEdit && loading) {
    return <Loading label="Loading project" />
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Project not found" />
        <Button asChild variant="outline" className="w-fit">
          <Link to={ROUTES.adminProjects}>Back to projects</Link>
        </Button>
      </div>
    )
  }

  return (
    <ProjectFormBody
      key={id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      create={create}
      update={update}
      mutating={mutating}
    />
  )
}

interface ProjectFormBodyProps {
  isEdit: boolean
  existing?: Project
  create: (input: Partial<Project>) => Promise<Project>
  update: (id: string, input: Partial<Project>) => Promise<Project>
  mutating: boolean
}

/**
 * Keyed by the route id in the parent above, so switching between
 * "new" and any given project's edit page remounts this with fresh
 * state — no effect needed to "catch up" once the project loads.
 */
function ProjectFormBody({ isEdit, existing, create, update, mutating }: ProjectFormBodyProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<ProjectFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleTitleChange = (title: string) => {
    setField('title', title)
    if (!slugTouched) {
      setValues((prev) => ({ ...prev, slug: slugify(title) }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<Project> = {
      ...values,
      thumbnail: values.thumbnail || undefined,
      githubUrl: values.githubUrl || undefined,
      liveUrl: values.liveUrl || undefined,
      problem: values.problem || undefined,
      solution: values.solution || undefined,
      architecture: values.architecture || undefined,
      outcome: values.outcome || undefined,
    }

    try {
      if (isEdit && existing) {
        await update(existing.id, payload)
      } else {
        await create(payload)
      }
      setDirty(false)
      navigate(ROUTES.adminProjects)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={isEdit ? 'Edit project' : 'Add project'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Basic Information">
          <FormField id="title" label="Title" required error={errors.title}>
            <Input id="title" value={values.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </FormField>
          <FormField
            id="slug"
            label="Slug"
            required
            error={errors.slug}
            helperText="Used in the project's public URL."
          >
            <Input
              id="slug"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setField('slug', e.target.value)
              }}
            />
          </FormField>
          <FormField
            id="shortDescription"
            label="Short description"
            required
            error={errors.shortDescription}
            className="sm:col-span-2"
          >
            <Textarea
              id="shortDescription"
              rows={2}
              value={values.shortDescription}
              onChange={(e) => setField('shortDescription', e.target.value)}
            />
          </FormField>
          <FormField id="description" label="Description" required error={errors.description} className="sm:col-span-2">
            <Textarea
              id="description"
              rows={5}
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </FormField>
        </FormSection>

        <FormSection title="Technology">
          <FormField id="technologies" label="Technologies" className="sm:col-span-2">
            <TagInput
              id="technologies"
              values={values.technologies}
              onChange={(v) => setField('technologies', v)}
              placeholder="Type a technology and press Enter"
            />
          </FormField>
        </FormSection>

        <FormSection title="Links">
          <FormField id="githubUrl" label="GitHub URL" error={errors.githubUrl}>
            <Input id="githubUrl" value={values.githubUrl} onChange={(e) => setField('githubUrl', e.target.value)} />
          </FormField>
          <FormField id="liveUrl" label="Live URL" error={errors.liveUrl}>
            <Input id="liveUrl" value={values.liveUrl} onChange={(e) => setField('liveUrl', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Case Study" description="Optional — shown on the project's case study page.">
          <FormField id="problem" label="Problem" className="sm:col-span-2">
            <Textarea id="problem" rows={3} value={values.problem} onChange={(e) => setField('problem', e.target.value)} />
          </FormField>
          <FormField id="solution" label="Solution" className="sm:col-span-2">
            <Textarea id="solution" rows={3} value={values.solution} onChange={(e) => setField('solution', e.target.value)} />
          </FormField>
          <FormField id="architecture" label="Architecture" className="sm:col-span-2">
            <Textarea
              id="architecture"
              rows={3}
              value={values.architecture}
              onChange={(e) => setField('architecture', e.target.value)}
            />
          </FormField>
          <FormField id="features" label="Features">
            <TagInput id="features" values={values.features} onChange={(v) => setField('features', v)} />
          </FormField>
          <FormField id="challenges" label="Challenges">
            <TagInput id="challenges" values={values.challenges} onChange={(v) => setField('challenges', v)} />
          </FormField>
          <FormField id="outcome" label="Outcome" className="sm:col-span-2">
            <Textarea id="outcome" rows={2} value={values.outcome} onChange={(e) => setField('outcome', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Media">
          <FormField id="thumbnail" label="Thumbnail URL" error={errors.thumbnail} className="sm:col-span-2">
            <Input id="thumbnail" value={values.thumbnail} onChange={(e) => setField('thumbnail', e.target.value)} />
          </FormField>
          <FormField id="gallery" label="Gallery URLs" className="sm:col-span-2">
            <TagInput
              id="gallery"
              values={values.gallery}
              onChange={(v) => setField('gallery', v)}
              placeholder="Paste an image URL and press Enter"
            />
          </FormField>
        </FormSection>

        <FormSection title="Publishing">
          <FormField id="status" label="Status">
            <Select
              id="status"
              value={values.status}
              onChange={(e) => setField('status', e.target.value as ProjectStatus)}
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {PROJECT_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="featured" label="Featured">
            <Switch
              id="featured"
              checked={values.featured}
              onChange={(e) => setField('featured', e.target.checked)}
              label="Show in featured projects"
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
            {isEdit ? 'Save changes' : 'Create project'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.adminProjects}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
