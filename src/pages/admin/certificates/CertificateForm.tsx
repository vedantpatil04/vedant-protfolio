import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminCertificates, useUnsavedChangesWarning } from '@/hooks/admin'
import { AdminPageHeader, FormField, FormSection } from '@/components/admin'
import { Button, Input, Textarea, Switch, Loading } from '@/components/ui'
import { ApiError } from '@/services/api'
import type { Certificate } from '@/types'
import { ROUTES } from '@/constants/routes'

interface CertificateFormValues {
  title: string
  issuer: string
  category: string
  issueDate: string
  description: string
  imageUrl: string
  pdfUrl: string
  credentialId: string
  verificationUrl: string
  featured: boolean
}

const EMPTY_FORM: CertificateFormValues = {
  title: '',
  issuer: '',
  category: '',
  issueDate: '',
  description: '',
  imageUrl: '',
  pdfUrl: '',
  credentialId: '',
  verificationUrl: '',
  featured: false,
}

function toFormValues(cert: Certificate): CertificateFormValues {
  return {
    title: cert.title,
    issuer: cert.issuer,
    category: cert.category ?? '',
    issueDate: cert.issueDate ? cert.issueDate.slice(0, 10) : '',
    description: cert.description ?? '',
    imageUrl: cert.imageUrl ?? '',
    pdfUrl: cert.pdfUrl ?? '',
    credentialId: cert.credentialId ?? '',
    verificationUrl: cert.verificationUrl ?? '',
    featured: cert.featured,
  }
}

const URL_PATTERN = /^https?:\/\/.+/i

function validate(values: CertificateFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.issuer.trim()) errors.issuer = 'Issuer is required.'
  if (!values.issueDate) errors.issueDate = 'Issue date is required.'
  if (values.imageUrl && !URL_PATTERN.test(values.imageUrl)) errors.imageUrl = 'Enter a full URL (https://…).'
  if (values.pdfUrl && !URL_PATTERN.test(values.pdfUrl)) errors.pdfUrl = 'Enter a full URL (https://…).'
  if (values.verificationUrl && !URL_PATTERN.test(values.verificationUrl)) {
    errors.verificationUrl = 'Enter a full URL (https://…).'
  }
  return errors
}

export default function CertificateForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  usePageTitle(isEdit ? 'Admin — Edit Certificate' : 'Admin — Add Certificate')
  const { items, loading, create, update, mutating } = useAdminCertificates()

  const existing = useMemo(() => (isEdit ? items.find((c) => c.id === id) : undefined), [items, isEdit, id])

  if (isEdit && loading) {
    return <Loading label="Loading certificate" />
  }

  if (isEdit && !loading && !existing) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Certificate not found" />
        <Button asChild variant="outline" className="w-fit">
          <Link to={ROUTES.adminCertificates}>Back to certificates</Link>
        </Button>
      </div>
    )
  }

  return (
    <CertificateFormBody
      key={id ?? 'new'}
      isEdit={isEdit}
      existing={existing}
      create={create}
      update={update}
      mutating={mutating}
    />
  )
}

interface CertificateFormBodyProps {
  isEdit: boolean
  existing?: Certificate
  create: (input: Partial<Certificate>) => Promise<Certificate>
  update: (id: string, input: Partial<Certificate>) => Promise<Certificate>
  mutating: boolean
}

function CertificateFormBody({ isEdit, existing, create, update, mutating }: CertificateFormBodyProps) {
  const navigate = useNavigate()

  const [values, setValues] = useState<CertificateFormValues>(() => (existing ? toFormValues(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesWarning(dirty)

  const setField = <K extends keyof CertificateFormValues>(key: K, value: CertificateFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload: Partial<Certificate> = {
      title: values.title,
      issuer: values.issuer,
      category: values.category || undefined,
      issueDate: values.issueDate,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
      pdfUrl: values.pdfUrl || undefined,
      credentialId: values.credentialId || undefined,
      verificationUrl: values.verificationUrl || undefined,
      featured: values.featured,
    }

    try {
      if (isEdit && existing) {
        await update(existing.id, payload)
      } else {
        await create(payload)
      }
      setDirty(false)
      navigate(ROUTES.adminCertificates)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={isEdit ? 'Edit certificate' : 'Add certificate'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FormSection title="Basic Information">
          <FormField id="title" label="Title" required error={errors.title}>
            <Input id="title" value={values.title} onChange={(e) => setField('title', e.target.value)} />
          </FormField>
          <FormField id="issuer" label="Issuer" required error={errors.issuer}>
            <Input id="issuer" value={values.issuer} onChange={(e) => setField('issuer', e.target.value)} />
          </FormField>
          <FormField id="category" label="Category" helperText="Optional">
            <Input id="category" value={values.category} onChange={(e) => setField('category', e.target.value)} />
          </FormField>
          <FormField id="issueDate" label="Issue date" required error={errors.issueDate}>
            <Input
              id="issueDate"
              type="date"
              value={values.issueDate}
              onChange={(e) => setField('issueDate', e.target.value)}
            />
          </FormField>
          <FormField id="description" label="Description" className="sm:col-span-2" helperText="Optional">
            <Textarea id="description" rows={3} value={values.description} onChange={(e) => setField('description', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Credential">
          <FormField id="credentialId" label="Credential ID" helperText="Optional">
            <Input id="credentialId" value={values.credentialId} onChange={(e) => setField('credentialId', e.target.value)} />
          </FormField>
          <FormField id="verificationUrl" label="Verification URL" error={errors.verificationUrl} helperText="Optional">
            <Input
              id="verificationUrl"
              value={values.verificationUrl}
              onChange={(e) => setField('verificationUrl', e.target.value)}
            />
          </FormField>
        </FormSection>

        <FormSection title="Media">
          <FormField id="imageUrl" label="Image URL" error={errors.imageUrl} helperText="Optional">
            <Input id="imageUrl" value={values.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} />
          </FormField>
          <FormField id="pdfUrl" label="PDF URL" error={errors.pdfUrl} helperText="Optional">
            <Input id="pdfUrl" value={values.pdfUrl} onChange={(e) => setField('pdfUrl', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Publishing">
          <FormField id="featured" label="Featured">
            <Switch
              id="featured"
              checked={values.featured}
              onChange={(e) => setField('featured', e.target.checked)}
              label="Show in featured certificates"
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
            {isEdit ? 'Save changes' : 'Create certificate'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.adminCertificates}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
