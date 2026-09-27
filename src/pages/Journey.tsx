import { Milestone, RefreshCw } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useJourney } from '@/hooks/useJourney'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { JourneyTimeline, JourneyTimelineSkeleton, CurrentFocus } from '@/components/journey'

export default function Journey() {
  usePageTitle('Developer Journey', 'How I got here.')
  const { entries, loading, error, reload } = useJourney()
  const currentFocus = entries.filter((entry) => entry.featured)

  return (
    <Section className="min-h-[70vh] pt-12 sm:pt-16 lg:pt-20">
      <Reveal>
        <SectionHeader titleAs="h1" eyebrow="Timeline" title="Developer Journey" description="How I got here — the chapters, in the order they happened." />
      </Reveal>

      <div className="mt-12 sm:mt-16">
        {loading && <JourneyTimelineSkeleton />}

        {!loading && error && (
          <div className="py-16">
            <EmptyState
              icon={Milestone}
              title="Couldn't load the journey timeline"
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

        {!loading && !error && entries.length === 0 && (
          <div className="py-16">
            <EmptyState icon={Milestone} title="No journey entries available." />
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <JourneyTimeline entries={entries} />
            </div>
            {currentFocus.length > 0 && (
              <Reveal delay={0.1} className="order-first lg:order-none lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <CurrentFocus entries={currentFocus} />
                </div>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}
