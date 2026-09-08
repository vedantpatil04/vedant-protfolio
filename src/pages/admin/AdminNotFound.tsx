import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/components/admin'
import { Button } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function AdminNotFound() {
  usePageTitle('Admin — Not Found')
  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Page not found" description="That admin page doesn't exist." />
      <Button asChild variant="outline" className="w-fit">
        <Link to={ROUTES.admin}>Back to overview</Link>
      </Button>
    </div>
  )
}
