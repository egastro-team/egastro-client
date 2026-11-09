import { PackageXIcon } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { OrderInfo, OrderItemsTable, OrderStatusBadge } from '@/features/orders'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiStatus, getErrorMessage } from '@/lib/api-error'
import { ORDER_STATUS_LABELS } from '@/lib/format'

import { useAdminOrder, useChangeOrderStatus } from '../api/admin-api'
import { ORDER_STATUS_TRANSITIONS, type AdminOrder } from '../schemas'

type AdminOrderViewProps = {
  orderId: number | null
}

export function AdminOrderView({ orderId }: AdminOrderViewProps) {
  const { data: order, isPending, isError, error, refetch } = useAdminOrder(orderId)

  if (orderId === null || (isError && getApiStatus(error) === 404)) {
    return (
      <EmptyState
        icon={PackageXIcon}
        title="Замовлення не знайдено"
        action={
          <Button asChild variant="outline">
            <Link to="/admin/orders">До списку замовлень</Link>
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
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Замовлення №{order.id}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <StatusActions order={order} />
      <OrderInfo order={order} extra={[{ label: 'Покупець', value: order.userEmail }]} />
      <OrderItemsTable items={order.items} totalAmount={order.totalAmount} />
    </div>
  )
}

const ACTION_LABELS = {
  NEW: 'Повернути в «Нове»',
  CONFIRMED: 'Підтвердити',
  COMPLETED: 'Позначити виконаним',
  CANCELLED: 'Скасувати',
} as const

function StatusActions({ order }: { order: AdminOrder }) {
  const changeStatus = useChangeOrderStatus(order.id)
  const transitions = ORDER_STATUS_TRANSITIONS[order.status]

  if (transitions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Статус «{ORDER_STATUS_LABELS[order.status]}» остаточний і не змінюється.
      </p>
    )
  }

  return (
    <section aria-label="Зміна статусу" className="flex flex-wrap gap-2">
      {transitions.map((status) => (
        <Button
          key={status}
          variant={
            status === 'CANCELLED' ? 'destructive' : status === 'NEW' ? 'outline' : 'default'
          }
          disabled={changeStatus.isPending}
          onClick={() =>
            changeStatus.mutate(status, {
              onSuccess: () => toast.success(`Статус змінено на «${ORDER_STATUS_LABELS[status]}»`),
              onError: (error) => toast.error(getErrorMessage(error)),
            })
          }
        >
          {ACTION_LABELS[status]}
        </Button>
      ))}
    </section>
  )
}
