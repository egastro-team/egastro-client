import { Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { ProductImage } from '@/features/catalog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/api-error'
import { formatPrice, formatUnitPrice } from '@/lib/format'

import { useRemoveCartItem, useSetCartItemQuantity } from '../api/cart-api'
import type { CartItem } from '../schemas'
import { QuantityStepper } from './quantity-stepper'

type CartItemRowProps = {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const setQuantity = useSetCartItemQuantity()
  const remove = useRemoveCartItem()

  return (
    <li className="flex gap-3 rounded-2xl border bg-card p-3 sm:gap-4 sm:p-4">
      <Link to={`/products/${item.productId}`} className="shrink-0" tabIndex={-1} aria-hidden>
        <ProductImage src={item.imageUrl} alt="" className="size-20 rounded-lg border sm:size-24" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <Link
              to={`/products/${item.productId}`}
              className="line-clamp-2 font-medium underline-offset-4 hover:underline"
            >
              {item.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatUnitPrice(item.unitPrice, item.unitOfMeasure)}
            </p>
            {!item.available && <Badge variant="destructive">Немає в наявності</Badge>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Видалити «${item.name}» з кошика`}
            disabled={remove.isPending}
            onClick={() =>
              remove.mutate(item.productId, {
                onError: (error) => toast.error(getErrorMessage(error)),
              })
            }
          >
            <Trash2Icon />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            label={`Кількість «${item.name}»`}
            value={item.quantity}
            onChange={(quantity) =>
              setQuantity.mutate(
                { productId: item.productId, quantity },
                { onError: (error) => toast.error(getErrorMessage(error)) },
              )
            }
          />
          <p className="font-semibold tabular-nums">{formatPrice(item.lineTotal)}</p>
        </div>
      </div>
    </li>
  )
}
