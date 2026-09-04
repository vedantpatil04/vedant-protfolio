import { Skeleton } from '@/components/ui'

export function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((group) => (
        <div key={group}>
          <Skeleton className="h-3.5 w-20" />
          <div className="mt-4 flex flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
