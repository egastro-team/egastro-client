import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'
import { formatPrice, pluralize } from '@/lib/format'

import type { Cart } from '../schemas'

type CartSummaryProps = {
  cart: Cart
  children?: ReactNode
}

export function CartSummary({ cart, children }: CartSummaryProps) {
  return (
    <section
      aria-labelledby="cart-summary-title"
      className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-5"
    >
      <h2 id="cart-summary-title" className="font-heading text-lg font-semibold">
        Разом
      </h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {cart.totalQuantity} {pluralize(cart.totalQuantity, 'одиниця', 'одиниці', 'одиниць')}{' '}
            товару
          </dt>
          <dd className="tabular-nums">{formatPrice(cart.totalAmount)}</dd>
        </div>
      </dl>
      <Separator />
      <p className="flex items-baseline justify-between gap-2">
        <span className="font-medium">До сплати</span>
        <span className="text-xl font-semibold tabular-nums">{formatPrice(cart.totalAmount)}</span>
      </p>
      {children}
    </section>
  )
}
