import { useState, type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, FileSearch, RefreshCw, ShieldCheck, ZoomIn } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useCertificate } from '@/hooks/useCertificate'
import { Section } from '@/components/layout'
import { Button, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/lib/utils'
import { CertificateViewer, CertificateDetailSkeleton } from '@/components/certificate'

export default function CertificateDetail() {
  const { id } = useParams<{ id: string }>()
  const { certificate, loading, notFound, error, reload } = useCertificate(id)
  const [viewerOpen, setViewerOpen] = useState(false)

  usePageTitle(
    certificate ? `${certificate.title} — ${certificate.issuer}` : 'Certificate',
    certificate?.description,
  )

  if (loading) return <CertificateDetailSkeleton />

  if (notFound) {
    return (
      <Section className="flex min-h-[70vh] items-center">
        <Reveal className="w-full">
          <EmptyState
            titleAs="h1"
            icon={FileSearch}
            title="No certificate found"
            description="It may have been moved or the link is out of date."
            action={
              <Button asChild size="lg">
                <Link to={ROUTES.certificates}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to Certificate Vault
                </Link>
              </Button>
            }
          />
        </Reveal>
      </Section>
    )
  }

  if (error || !certificate) {
    return (
      <Section className="flex min-h-[70vh] items-center">
        <Reveal className="w-full">
          <EmptyState
            titleAs="h1"
            icon={ShieldCheck}
            title="Couldn't load this certificate"
            description={error ?? undefined}
            action={
              <Button variant="outline" onClick={reload}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Try again
              </Button>
            }
          />
        </Reveal>
      </Section>
    )
  }

  const date = formatDate(certificate.issueDate, { month: 'long', day: 'numeric', year: 'numeric' })

  const facts = [
    date && { label: 'Issued', value: <time dateTime={certificate.issueDate} className="tabular">{date}</time> },
    { label: 'Issuer', value: certificate.issuer },
    certificate.category && { label: 'Category', value: <span className="capitalize">{certificate.category}</span> },
    certificate.credentialId && {
      label: 'Credential',
      value: <span className="break-all font-mono text-caption">{certificate.credentialId}</span>,
    },
  ].filter(Boolean) as { label: string; value: ReactNode }[]

  return (
    <Section compact as="div" className="pt-8 sm:pt-12 lg:pt-14">
      <Reveal>
        <Link
          to={ROUTES.certificates}
          className="nudge-icons inline-flex min-h-11 items-center gap-2 text-body-sm text-text-secondary transition-colors hover:text-text"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="link-underline">Certificate Vault</span>
        </Link>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-10 sm:mt-8 lg:grid-cols-12 lg:gap-10">
        {/* Document */}
        <Reveal variant="fade" className="lg:col-span-7">
          {certificate.imageUrl ? (
            <button
              type="button"
              onClick={() => setViewerOpen(true)}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-md border border-border bg-surface-2 p-5 transition-colors hover:border-border-strong sm:p-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
              aria-label={`Open enlarged view of ${certificate.title}`}
            >
              <img
                src={certificate.imageUrl}
                alt={`${certificate.title} certificate`}
                decoding="async"
                fetchPriority="high"
                className="max-h-[70vh] w-auto max-w-full object-contain shadow-[0_1px_2px_hsl(var(--shadow-color)/0.08),0_12px_32px_-16px_hsl(var(--shadow-color)/0.4)] transition-transform duration-500 ease-[var(--ease-out-expo)] motion-safe:group-hover:-translate-y-1"
              />
              {/* Always visible (not hover-only), stronger on hover/focus */}
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm border border-border bg-surface/90 px-2.5 py-1.5 text-caption font-medium text-text-secondary transition-colors group-hover:text-text group-focus-visible:text-text">
                <ZoomIn className="size-3.5" aria-hidden="true" />
                Enlarge
              </span>
            </button>
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-md border border-border bg-surface-2 text-text-tertiary">
              <ShieldCheck className="size-8" aria-hidden="true" />
              <span className="text-body-sm">No preview available</span>
            </div>
          )}
        </Reveal>

        {/* Record */}
        <Reveal delay={0.08} className="lg:col-span-5">
          <div className="flex flex-col lg:sticky lg:top-28">
            <span className="text-label flex items-center gap-2.5 text-accent">
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              Certificate
            </span>
            <h1 className="mt-5 text-h2 text-text">{certificate.title}</h1>
            <p className="mt-3 text-lead text-text-secondary">{certificate.issuer}</p>

            <dl className="mt-8 border-t border-border">
              {facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-3.5 text-body-sm">
                  <dt className="text-label pt-0.5 text-text-tertiary">{fact.label}</dt>
                  <dd className="min-w-0 text-text">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {(certificate.pdfUrl || certificate.verificationUrl) && (
              <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                {certificate.verificationUrl && (
                  <Button asChild>
                    <a href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer">
                      Verify credential
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                )}
                {certificate.pdfUrl && (
                  <Button asChild variant="outline">
                    <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer">
                      Open PDF
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                )}
              </div>
            )}

            {certificate.description && (
              <div className="mt-10 border-t border-border pt-6">
                <h2 className="text-label text-text-tertiary">About this credential</h2>
                <p className="mt-3 whitespace-pre-line text-body text-text-secondary">{certificate.description}</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {certificate.imageUrl && (
        <CertificateViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          imageUrl={certificate.imageUrl}
          title={certificate.title}
        />
      )}
    </Section>
  )
}
