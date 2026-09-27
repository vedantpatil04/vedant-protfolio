import { RefreshCw, Trophy } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAchievements } from '@/hooks/useAchievements'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { AchievementTimeline, AchievementTimelineSkeleton } from '@/components/achievement'

export default function Achievements() {
  usePageTitle('Achievements', 'Milestones beyond the code.')
  const { achievements, loading, error, reload } = useAchievements()

  return (
    <Section className="min-h-[70vh] pt-12 sm:pt-16 lg:pt-20">
      <Reveal>
        <SectionHeader titleAs="h1" eyebrow="Recognition" title="Achievements" description="Milestones beyond the code." />
      </Reveal>

      <div className="mt-12 sm:mt-16">
        {loading && <AchievementTimelineSkeleton />}

        {!loading && error && (
          <div className="py-16">
            <EmptyState
              icon={Trophy}
              title="Couldn't load achievements"
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

        {!loading && !error && achievements.length === 0 && (
          <div className="py-16">
            <EmptyState icon={Trophy} title="No achievements listed yet." />
          </div>
        )}

        {!loading && !error && achievements.length > 0 && (
          <AchievementTimeline achievements={achievements} />
        )}
      </div>
    </Section>
  )
}
