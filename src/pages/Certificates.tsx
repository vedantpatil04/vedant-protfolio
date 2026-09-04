import { useMemo, useState } from 'react'
import { ShieldCheck, RefreshCw } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useCertificates } from '@/hooks/useCertificates'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button, Divider } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { CertificateCard, CertificateCardSkeleton } from '@/components/certificate'

const ALL_CATEGORY = 'All'

export default function Certificates() {
  usePageTitle('Certificate Vault', 'Credentials and milestones from my development journey.')
  const { certificates, loading, error, reload } = useCertificates()
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)

  // Categories are derived from real data rather than a fixed list, so
  // the filter bar never shows a category with nothing behind it.
  const categories = useMemo(() => {
    const found = new Set<string>()
    for (const certificate of certificates) {
      if (certificate.category) found.add(certificate.category)
    }
    return [ALL_CATEGORY, ...Array.from(found).sort()]
  }, [certificates])

  const filtered = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return certificates
    return certificates.filter((certificate) => certificate.category === activeCategory)
  }, [certificates, activeCategory])

  return (
    <Section className="min-h-[70vh]">
      <Reveal>
        <SectionHeader
          eyebrow="Verified"
          title="Certificate Vault"
          description="Credentials and milestones from my development journey."
        />
      </Reveal>

      {!loading && !error && categories.length > 1 && (
        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter certificates by category">
            {categories.map((category) => {
              const active = category === activeCategory
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={
                    active
                      ? 'rounded-sm border border-accent bg-accent/10 px-3 py-1.5 text-body-sm font-medium text-accent capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]'
                      : 'rounded-sm border border-border px-3 py-1.5 text-body-sm text-text-secondary capitalize transition-colors hover:border-border-strong hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]'
                  }
                >
                  {category}
                </button>
              )
            })}
          </div>
        </Reveal>
      )}

      <Divider className="mt-10" />

      <div className="mt-10">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {[0, 1, 2, 3].map((i) => (
              <CertificateCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-16">
            <EmptyState
              icon={ShieldCheck}
              title="Couldn't load certificates"
              description={error}
              action={
                <Button variant="outline" onClick={reload}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Try again
                </Button>
              }
            />
          </div>
        )}

        {!loading && !error && certificates.length === 0 && (
          <div className="py-16">
            <EmptyState icon={ShieldCheck} title="No certificates published yet." />
          </div>
        )}

        {!loading && !error && certificates.length > 0 && filtered.length === 0 && (
          <div className="py-16">
            <EmptyState icon={ShieldCheck} title="No certificates in this category." />
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {filtered.map((certificate, i) => (
              <Reveal key={certificate.id} delay={Math.min(i * 0.04, 0.2)}>
                <CertificateCard
                  certificate={certificate}
                  large={certificate.featured}
                  className={certificate.featured ? 'sm:col-span-2' : undefined}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
