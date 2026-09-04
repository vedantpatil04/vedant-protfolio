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
    <Section className="min-h-[70vh]">
      <Reveal>
        <SectionHeader eyebrow="Timeline" title="Developer Journey" description="How I got here." />
      </Reveal>

      <div className="mt-12">
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
          <div className="flex flex-col gap-12">
            {currentFocus.length > 0 && (
              <Reveal>
                <CurrentFocus entries={currentFocus} />
              </Reveal>
            )}
            <Reveal delay={0.05}>
              <JourneyTimeline entries={entries} />
            </Reveal>
          </div>
        )}
      </div>
    </Section>
  )
}
