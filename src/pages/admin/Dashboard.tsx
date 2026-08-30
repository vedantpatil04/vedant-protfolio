import { LayoutDashboard } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'

export default function AdminDashboard() {
  usePageTitle('Admin')
  return (
    <PagePlaceholder
      eyebrow="Restricted"
      title="Admin"
      description="Content management for projects, certificates and achievements — arriving with the backend."
      icon={LayoutDashboard}
      emptyTitle="Admin dashboard not built yet"
    />
  )
}
