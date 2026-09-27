import { Reveal } from '@/components/shared'
import { ProjectImage } from './ProjectImage'

export interface ProjectGalleryProps {
  images: string[]
  projectTitle: string
}

/** Real screenshots, each revealed as it enters view; the first spans full width when there are 3+. */
export function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      {images.map((img, i) => (
        <Reveal
          key={img + i}
          variant="image"
          className={images.length >= 3 && i === 0 ? 'sm:col-span-2' : undefined}
        >
          <ProjectImage src={img} alt={`${projectTitle} screenshot ${i + 1}`} aspect="aspect-[16/10]" />
        </Reveal>
      ))}
    </div>
  )
}
