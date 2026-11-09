import { formatDateTime } from '@/lib/format'

type OrderInfoProps = {
  order: {
    createdAt: string
    deliveryAddress: string
    contactPhone: string
    comment?: string
  }
  /** Extra rows, e.g. the customer email in the admin panel. */
  extra?: { label: string; value: string }[]
}

export function OrderInfo({ order, extra = [] }: OrderInfoProps) {
  const rows = [
    ...extra,
    { label: 'Створено', value: formatDateTime(order.createdAt) },
    { label: 'Адреса доставки', value: order.deliveryAddress },
    { label: 'Телефон', value: order.contactPhone },
    ...(order.comment ? [{ label: 'Коментар', value: order.comment }] : []),
  ]
  return (
    <dl className="grid gap-3 rounded-xl border p-4 text-sm sm:grid-cols-[10rem_1fr]">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="break-words whitespace-pre-line">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
