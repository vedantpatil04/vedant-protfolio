import { Skeleton } from '@/components/ui'

/** Mirrors AchievementTimeline's year rail + entries layout. */
export function AchievementTimelineSkeleton() {
  return (
    <div className="grid grid-cols-1 border-t border-border lg:grid-cols-12 lg:gap-10">
      <div className="pb-2 pt-6 lg:col-span-3 lg:pt-8">
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="lg:col-span-9">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-3 border-b border-border py-7 last:border-b-0 lg:py-8">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
