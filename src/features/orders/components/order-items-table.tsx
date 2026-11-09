import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPrice } from '@/lib/format'

import type { OrderItem } from '../schemas'

type OrderItemsTableProps = {
  items: OrderItem[]
  totalAmount: number
}

/** Order lines are snapshots taken at checkout, so they are shown without catalog links. */
export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead className="text-right">Ціна</TableHead>
            <TableHead className="text-right">К-сть</TableHead>
            <TableHead className="text-right">Сума</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell className="max-w-48 font-medium whitespace-normal">
                {item.productName}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPrice(item.unitPrice)}
              </TableCell>
              <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPrice(item.lineTotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Разом</TableCell>
            <TableCell className="text-right font-semibold tabular-nums">
              {formatPrice(totalAmount)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
