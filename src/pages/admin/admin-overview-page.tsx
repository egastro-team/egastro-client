import { AdminOverview } from '@/features/admin'
import { PageHeading } from '@/components/layout/page-heading'

export function AdminOverviewPage() {
  return (
    <>
      <PageHeading title="Адмін-панель" description="Керування каталогом і замовленнями" />
      <AdminOverview />
    </>
  )
}
