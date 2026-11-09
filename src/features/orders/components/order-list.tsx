import { ChevronRightIcon, PackageIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { PaginationNav } from '@/components/pagination-nav'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, formatPrice, pluralize } from '@/lib/format'

import { useOrders } from '../api/orders-api'
import { OrderStatusBadge } from './order-status-badge'

export function OrderList() {
  const [searchParams] = useSearchParams()
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const { data, isPending, isError, error, refetch } = useOrders(page - 1)

  if (isPending) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        {['a', 'b', 'c'].map((key) => (
          <Skeleton key={key} className="h-20 w-full" />
        ))}
      </div>
    )
  }
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />
  if (data.totalElements === 0) {
    return (
      <EmptyState
        icon={PackageIcon}
        title="Замовлень поки немає"
        description="Оформлені замовлення зʼявляться тут."
        action={
          <Button asChild>
            <Link to="/">До каталогу</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {data.content.map((order) => (
          <li key={order.id}>
            <Link
              to={`/orders/${order.id}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Замовлення №{order.id}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDateTime(order.createdAt)} · {order.itemsCount}{' '}
                  {pluralize(order.itemsCount, 'одиниця', 'одиниці', 'одиниць')}
                </span>
              </div>
              <span className="font-semibold tabular-nums">{formatPrice(order.totalAmount)}</span>
              <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <PaginationNav
        page={page}
        totalPages={data.totalPages}
        hrefFor={(p) => (p === 1 ? '?' : `?page=${p}`)}
      />
    </div>
  )
}
