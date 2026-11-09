import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/lib/api-schemas'
import { ORDER_STATUS_LABELS } from '@/lib/format'

const STATUS_VARIANTS = {
  NEW: 'secondary',
  CONFIRMED: 'default',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
} as const satisfies Record<OrderStatus, 'secondary' | 'default' | 'outline' | 'destructive'>

type OrderStatusBadgeProps = {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANTS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>
}
