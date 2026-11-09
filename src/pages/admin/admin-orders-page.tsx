import { AdminOrdersTable } from '@/features/admin'
import { PageHeading } from '@/components/layout/page-heading'

export function AdminOrdersPage() {
  return (
    <>
      <PageHeading title="Замовлення" description="Усі замовлення покупців, нові — зверху" />
      <AdminOrdersTable />
    </>
  )
}
