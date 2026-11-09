import { PackageXIcon } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiStatus } from '@/lib/api-error'

import { useOrder } from '../api/orders-api'
import { CancelOrderButton } from './cancel-order-button'
import { OrderInfo } from './order-info'
import { OrderItemsTable } from './order-items-table'
import { OrderStatusBadge } from './order-status-badge'

type OrderDetailsProps = {
  orderId: number | null
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { data: order, isPending, isError, error, refetch } = useOrder(orderId)

  if (orderId === null || (isError && getApiStatus(error) === 404)) {
    return (
      <EmptyState
        icon={PackageXIcon}
        title="Замовлення не знайдено"
        action={
          <Button asChild variant="outline">
            <Link to="/orders">До моїх замовлень</Link>
          </Button>
        }
      />
    )
  }
  if (isPending) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Замовлення №{order.id}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        {order.status === 'NEW' && <CancelOrderButton orderId={order.id} />}
      </div>
      <OrderInfo order={order} />
      <OrderItemsTable items={order.items} totalAmount={order.totalAmount} />
    </div>
  )
}
