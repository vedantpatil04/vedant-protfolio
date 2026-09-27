import { Skeleton } from '@/components/ui'

/** Mirrors JourneyTimeline's date rail + content column. */
export function JourneyTimelineSkeleton() {
  return (
    <div className="flex flex-col">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="grid grid-cols-1 gap-3 pb-12 pl-8 last:pb-0 sm:grid-cols-[7rem_1fr] sm:gap-x-12 sm:pl-0 lg:grid-cols-[9rem_1fr] lg:gap-x-14"
        >
          <Skeleton className="h-6 w-14 sm:ml-auto" />
          <div className="flex flex-col gap-3 sm:pl-3 lg:pl-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
