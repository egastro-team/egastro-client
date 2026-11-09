import { OrderList } from '@/features/orders'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeading } from '@/components/layout/page-heading'

export function OrdersPage() {
  return (
    <PageContainer className="max-w-3xl">
      <PageHeading title="Мої замовлення" />
      <OrderList />
    </PageContainer>
  )
}
