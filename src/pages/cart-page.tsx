import { CartView } from '@/features/cart'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeading } from '@/components/layout/page-heading'

export function CartPage() {
  return (
    <PageContainer>
      <PageHeading title="Ваш кошик" />
      <CartView />
    </PageContainer>
  )
}
