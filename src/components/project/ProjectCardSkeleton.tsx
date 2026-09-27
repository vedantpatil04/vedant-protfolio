import { Skeleton } from '@/components/ui'

export interface ProjectCardSkeletonProps {
  first?: boolean
}

/** Mirrors ProjectCard's editorial row so loading → loaded doesn't shift layout. */
export function ProjectCardSkeleton({ first = false }: ProjectCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-7 border-t border-border py-8 sm:py-10 md:grid-cols-12 md:gap-10 lg:py-14">
      <div className="flex flex-col gap-4 md:col-span-5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
      <div className="md:col-span-7">
        <Skeleton className={first ? 'aspect-[16/10] w-full' : 'aspect-[16/10] w-full opacity-70'} />
      </div>
    </div>
  )
}
