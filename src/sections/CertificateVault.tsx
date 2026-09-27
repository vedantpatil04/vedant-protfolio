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

  // Featured certificates first, then the most recent real ones fill the
  // remaining slots — the preview is always a full row when there's
  // enough data, and never invents anything when there isn't.
  const featured = certificates.filter((certificate) => certificate.featured)
  const rest = certificates.filter((certificate) => !certificate.featured)
  const preview = [...featured, ...rest].slice(0, PREVIEW_COUNT)

  return (
    <Section id="certificates">
      <Reveal>
        <SectionHeader
          index={3}
          eyebrow="Verified"
          title="Certificate Vault"
          description="Credentials from the journey so far — each one viewable in full."
          action={
            !loading && !error && certificates.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={ROUTES.certificates}>
                  {certificates.length > PREVIEW_COUNT ? `All ${certificates.length} certificates` : 'Open the vault'}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10 sm:mt-14">
        {loading && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {[0, 1, 2].map((i) => (
              <CertificateCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && (error || certificates.length === 0) && (
          <Reveal delay={0.05}>
            <EmptyState icon={ShieldCheck} title="No certificates added yet" />
          </Reveal>
        )}

        {!loading && !error && preview.length > 0 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {preview.map((certificate, i) => (
              <Reveal
                key={certificate.id}
                delay={Math.min(i * 0.06, 0.18)}
                className={preview.length === 3 && i === 2 ? 'sm:max-lg:hidden' : undefined}
              >
                <CertificateCard certificate={certificate} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
