import { Divider, Skeleton } from '@/components/ui'

export function AchievementTimelineSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-3 h-8 w-16" />
      <Divider />
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <Skeleton className="h-4 w-16 shrink-0" />
          </div>
          <Divider />
        </div>
      ))}
    </div>
  )
}
