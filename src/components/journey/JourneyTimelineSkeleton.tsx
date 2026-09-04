import { Skeleton } from '@/components/ui'

export function JourneyTimelineSkeleton() {
  return (
    <div className="flex flex-col">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-b border-border py-8 first:pt-0 last:border-b-0 sm:grid-cols-[6rem_1fr] sm:gap-x-8"
        >
          <Skeleton className="h-4 w-10" />
          <div className="flex flex-col gap-3 border-l border-border pl-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
