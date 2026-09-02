import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ProjectImageProps {
  src: string
  alt: string
  aspect?: string
  priority?: boolean
  className?: string
}

export function ProjectImage({
  src,
  alt,
  aspect = 'aspect-video',
  priority = false,
  className,
}: ProjectImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md border border-border bg-surface-2',
        aspect,
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'size-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
      {!loaded && <div className="absolute inset-0 animate-pulse bg-surface-2" aria-hidden="true" />}
    </div>
  )
}
