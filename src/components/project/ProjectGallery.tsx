import { ProjectImage } from './ProjectImage'

export interface ProjectGalleryProps {
  images: string[]
  projectTitle: string
}

export function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {images.map((img, i) => (
        <ProjectImage
          key={img + i}
          src={img}
          alt={`${projectTitle} screenshot ${i + 1}`}
          aspect="aspect-video"
        />
      ))}
    </div>
  )
}
