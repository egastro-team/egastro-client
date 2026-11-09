import { InboxIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'

import { OrderStatusBadge } from '@/features/orders'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { PaginationNav } from '@/components/pagination-nav'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatPrice, ORDER_STATUS_LABELS } from '@/lib/format'

import { useAdminOrders } from '../api/admin-api'
import { orderStatusSchema } from '../schemas'

const ALL_STATUSES = 'all'

export function AdminOrdersTable() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusParse = orderStatusSchema.safeParse(searchParams.get('status'))
  const status = statusParse.success ? statusParse.data : undefined
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const orders = useAdminOrders({ status, page: page - 1 })

  function hrefFor(nextPage: number) {
    const next = new URLSearchParams(searchParams)
    if (nextPage <= 1) next.delete('page')
    else next.set('page', String(nextPage))
    return `?${next.toString()}`
  }

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={status ?? ALL_STATUSES}
        onValueChange={(value) => {
          const next = new URLSearchParams()
          if (value !== ALL_STATUSES) next.set('status', value)
          setSearchParams(next)
        }}
      >
        <SelectTrigger className="h-9 w-full sm:w-56" aria-label="Фільтр за статусом">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUSES}>Усі статуси</SelectItem>
          {orderStatusSchema.options.map((option) => (
            <SelectItem key={option} value={option}>
              {ORDER_STATUS_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {orders.isPending ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {['a', 'b', 'c', 'd'].map((key) => (
            <Skeleton key={key} className="h-12 w-full" />
          ))}
        </div>
      ) : orders.isError ? (
        <ErrorState error={orders.error} onRetry={() => orders.refetch()} />
      ) : orders.data.content.length === 0 ? (
        <EmptyState icon={InboxIcon} title="Замовлень не знайдено" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Покупець</TableHead>
                  <TableHead className="hidden md:table-cell">Створено</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Сума</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.content.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        №{order.id}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-40 truncate">{order.userEmail}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationNav page={page} totalPages={orders.data.totalPages} hrefFor={hrefFor} />
        </>
      )}
    </div>
  )
}
