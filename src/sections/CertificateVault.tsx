import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useCertificates } from '@/hooks/useCertificates'
import { ROUTES } from '@/constants/routes'
import { CertificateCard, CertificateCardSkeleton } from '@/components/certificate'

const PREVIEW_COUNT = 3

export function CertificateVault() {
  const { certificates, loading, error } = useCertificates()

  // Prefer certificates explicitly marked featured; if none are
  // flagged yet, fall back to the most recent real ones rather than
  // leaving the homepage section permanently empty. Never invents data.
  const featured = certificates.filter((certificate) => certificate.featured)
  const preview = (featured.length > 0 ? featured : certificates).slice(0, PREVIEW_COUNT)

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Verified"
          title="Certificate Vault"
          description="A few credentials from the journey so far."
          action={
            !loading && !error && certificates.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={ROUTES.certificates}>
                  View all certificates
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            <CertificateCardSkeleton />
            <CertificateCardSkeleton />
          </div>
        )}

        {!loading && (error || certificates.length === 0) && (
          <Reveal delay={0.05}>
            <EmptyState icon={ShieldCheck} title="No certificates added yet" />
          </Reveal>
        )}

        {!loading && !error && preview.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {preview.map((certificate, i) => (
              <Reveal key={certificate.id} delay={Math.min(i * 0.05, 0.15)}>
                <CertificateCard
                  certificate={certificate}
                  large={i === 0}
                  className={i === 0 ? 'sm:col-span-2' : undefined}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
