import { Link } from 'react-router-dom'
import { ArrowUpRight, Trophy } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button, Skeleton } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useAchievements } from '@/hooks/useAchievements'
import { ROUTES } from '@/constants/routes'
import { AchievementPreviewRow } from '@/components/achievement'

const PREVIEW_COUNT = 3

export function AchievementsSection() {
  const { achievements, loading, error } = useAchievements()
  const preview = achievements.slice(0, PREVIEW_COUNT)

  return (
    <Section id="achievements">
      <Reveal>
        <SectionHeader
          index={4}
          eyebrow="Recognition"
          title="Achievements"
          description="Milestones beyond the code."
          action={
            !loading && !error && achievements.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={ROUTES.achievements}>
                  View achievements
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10 sm:mt-14">
        {loading && (
          <div className="flex flex-col gap-5 border-t border-border pt-5">
            <Skeleton className="h-7 w-full max-w-lg" />
            <Skeleton className="h-7 w-full max-w-md" />
          </div>
        )}

        {!loading && (error || achievements.length === 0) && (
          <Reveal delay={0.05}>
            <EmptyState icon={Trophy} title="No achievements listed yet" />
          </Reveal>
        )}

        {!loading && !error && preview.length > 0 && (
          <Reveal delay={0.05}>
            <ul>
              {preview.map((achievement) => (
                <AchievementPreviewRow key={achievement.id} achievement={achievement} />
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </Section>
  )
}
