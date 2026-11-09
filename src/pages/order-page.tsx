import { ArrowLeftIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { OrderDetails } from '@/features/orders'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { parseId } from '@/lib/parse-id'

export function OrderPage() {
  const { orderId } = useParams()
  const id = parseId(orderId)
  return (
    <PageContainer className="max-w-3xl">
      <title>{`Замовлення №${orderId ?? ''} · єГастро`}</title>
      <div>
        <Button variant="ghost" asChild className="-ml-2">
          <Link to="/orders">
            <ArrowLeftIcon />
            Мої замовлення
          </Link>
        </Button>
      </div>
      <OrderDetails orderId={id} />
    </PageContainer>
  )
}
