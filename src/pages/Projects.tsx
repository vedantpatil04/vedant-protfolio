import { FolderGit2 } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'

export default function Projects() {
  usePageTitle('Projects')
  return (
    <PagePlaceholder
      eyebrow="Selected work"
      title="Projects"
      description="A full, filterable list of projects — arriving once project data is connected."
      icon={FolderGit2}
      emptyTitle="No projects added yet"
    />
  )
}
