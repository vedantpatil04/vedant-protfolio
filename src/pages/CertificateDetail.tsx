import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Calendar, FileSearch, RefreshCw, ShieldCheck, ZoomIn } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useCertificate } from '@/hooks/useCertificate'
import { Section, AsymmetricLayout } from '@/components/layout'
import { Button, EmptyState, Badge } from '@/components/ui'
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
        <Reveal>
          <EmptyState
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
        <Reveal>
          <EmptyState
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

  return (
    <Section compact as="div" className="pt-14 sm:pt-20">
      <Reveal>
        <Link
          to={ROUTES.certificates}
          className="inline-flex items-center gap-1.5 text-body-sm text-text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Certificate Vault
        </Link>
      </Reveal>

      <div className="mt-6">
        <AsymmetricLayout
          primary={
            <Reveal>
              {certificate.imageUrl ? (
                <button
                  type="button"
                  onClick={() => setViewerOpen(true)}
                  className="group relative block w-full overflow-hidden rounded-md border border-border bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
                  aria-label="Open enlarged certificate view"
                >
                  <img
                    src={certificate.imageUrl}
                    alt={`${certificate.title} certificate`}
                    className="mx-auto max-h-[70vh] w-full object-contain p-6"
                  />
                  <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-sm border border-border bg-surface/90 px-2.5 py-1.5 text-caption font-medium text-text-secondary opacity-0 transition-opacity group-hover:opacity-100">
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
          }
          secondary={
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-6 rounded-md border border-border bg-surface p-6">
                <div className="flex flex-col gap-2">
                  <span className="text-label text-accent">Certificate</span>
                  <h1 className="text-h2 text-text text-balance">{certificate.title}</h1>
                  <p className="text-body text-text-secondary">{certificate.issuer}</p>
                </div>

                <div className="flex flex-col gap-4 border-t border-border pt-5 text-body-sm">
                  {date && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="size-4 text-text-tertiary" aria-hidden="true" />
                        Issued
                      </span>
                      <span className="font-mono text-text">{date}</span>
                    </div>
                  )}

                  {certificate.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Category</span>
                      <Badge variant="neutral" className="capitalize">
                        {certificate.category}
                      </Badge>
                    </div>
                  )}

                  {certificate.credentialId && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-text-secondary">Credential ID</span>
                      <span className="truncate font-mono text-caption text-text">{certificate.credentialId}</span>
                    </div>
                  )}
                </div>

                {(certificate.pdfUrl || certificate.verificationUrl) && (
                  <div className="flex flex-col gap-3 border-t border-border pt-5">
                    {certificate.pdfUrl && (
                      <Button asChild variant="secondary">
                        <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer">
                          Open PDF
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      </Button>
                    )}
                    {certificate.verificationUrl && (
                      <Button asChild variant="outline">
                        <a href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer">
                          Verify credential
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          }
        />
      </div>

      {certificate.description && (
        <Reveal delay={0.15}>
          <div className="mt-14 max-w-2xl">
            <span className="text-label text-text-tertiary">About this credential</span>
            <p className="mt-4 whitespace-pre-line text-body-lg text-text-secondary">
              {certificate.description}
            </p>
          </div>
        </Reveal>
      )}

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
