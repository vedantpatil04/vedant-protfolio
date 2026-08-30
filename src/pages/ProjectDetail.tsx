import { useParams } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  usePageTitle('Project')
  return (
    <PagePlaceholder
      eyebrow="Case study"
      title="Project detail"
      icon={FileSearch}
      emptyTitle={`No project found for "${slug}"`}
      emptyDescription="Individual project pages will render here once project data exists."
    />
  )
}
