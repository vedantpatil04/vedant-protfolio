import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, RefreshCw } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useCertificates } from '@/hooks/useCertificates'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { CertificateCard, CertificateCardSkeleton } from '@/components/certificate'
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion'
import { cn } from '@/lib/utils'

const ALL_CATEGORY = 'All'

export default function Certificates() {
  usePageTitle('Certificate Vault', 'Credentials and milestones from my development journey.')
  const { certificates, loading, error, reload } = useCertificates()
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)

  // Categories (with real counts) are derived from the data rather than a
  // fixed list, so the filter bar never shows a category with nothing behind it.
  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const certificate of certificates) {
      if (certificate.category) counts.set(certificate.category, (counts.get(certificate.category) ?? 0) + 1)
    }
    return [
      { name: ALL_CATEGORY, count: certificates.length },
      ...Array.from(counts.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count]) => ({ name, count })),
    ]
  }, [certificates])

  const filtered = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return certificates
    return certificates.filter((certificate) => certificate.category === activeCategory)
  }, [certificates, activeCategory])

  return (
    <Section className="min-h-[70vh] pt-12 sm:pt-16 lg:pt-20">
      <Reveal>
        <SectionHeader
          titleAs="h1"
          eyebrow="Verified"
          title="Certificate Vault"
          description="Credentials and milestones from my development journey."
        />
      </Reveal>

      {/* Filter — a toggle-button group (aria-pressed), not tabs: it filters one list rather than switching panels. */}
      {!loading && !error && categories.length > 2 && (
        <Reveal delay={0.05}>
          <div
            className="-mx-4 mt-10 overflow-x-auto px-4 xs:-mx-5 xs:px-5 sm:mx-0 sm:px-0"
            role="group"
            aria-label="Filter certificates by category"
          >
            <div className="flex w-max gap-1 border-b border-border sm:w-auto sm:flex-wrap">
              {categories.map(({ name, count }) => {
                const active = name === activeCategory
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveCategory(name)}
                    className={cn(
                      'relative inline-flex min-h-11 items-center gap-2 px-3 text-body-sm capitalize transition-colors duration-200',
                      active ? 'font-medium text-text' : 'text-text-secondary hover:text-text',
                    )}
                  >
                    {name}
                    <span className="font-mono text-caption tabular text-text-tertiary">{count}</span>
                    {active && (
                      <motion.span
                        layoutId="certificate-filter-indicator"
                        className="absolute inset-x-2 -bottom-px h-px bg-accent"
                        transition={{ duration: DURATION.base * 1.4, ease: EASE_OUT_EXPO }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-10 sm:mt-12">
        {loading && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
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
          <motion.div layout className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((certificate, i) => (
                <motion.div
                  key={certificate.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO, delay: Math.min(i * 0.04, 0.24) },
                  }}
                  exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
                >
                  <CertificateCard certificate={certificate} large={certificate.featured} titleAs="h2" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Section>
  )
}
