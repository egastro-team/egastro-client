import { ArrowLeftIcon, ShoppingBasketIcon } from 'lucide-react'
import { Link } from 'react-router'

import { CartSummary, useCart } from '@/features/cart'
import { CheckoutForm } from '@/features/orders'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeading } from '@/components/layout/page-heading'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/format'

export function CheckoutPage() {
  const { data: cart, isPending, isError, error, refetch } = useCart()

  return (
    <PageContainer>
      <div>
        <Button variant="ghost" asChild className="-ml-2">
          <Link to="/cart">
            <ArrowLeftIcon />
            Назад до кошика
          </Link>
        </Button>
      </div>
      <PageHeading title="Оформлення замовлення" />
      {isPending ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : cart.items.length === 0 ? (
        <EmptyState
          icon={ShoppingBasketIcon}
          title="Кошик порожній"
          description="Додайте товари, щоб оформити замовлення."
          action={
            <Button asChild>
              <Link to="/">До каталогу</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <CheckoutForm disabled={cart.items.some((item) => !item.available)} />
          <CartSummary cart={cart}>
            <ul className="flex flex-col gap-2 text-sm">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 tabular-nums">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
          </CartSummary>
        </div>
      )}
    </PageContainer>
  )
}
