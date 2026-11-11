import { ShoppingBasketIcon, TriangleAlertIcon } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useCart } from '../api/cart-api'
import { CartItemRow } from './cart-item-row'
import { CartRecommendations } from './cart-recommendations'
import { CartSummary } from './cart-summary'

export function CartView() {
  const { data: cart, isPending, isError, error, refetch } = useCart()

  if (isPending) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]" aria-busy="true">
        <div className="flex flex-col gap-4">
          {['a', 'b', 'c'].map((key) => (
            <Skeleton key={key} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col gap-10">
        <EmptyState
          icon={ShoppingBasketIcon}
          title="Кошик порожній"
          description="Додайте товари з каталогу — і ми підкажемо, що до них пасує."
          action={
            <Button asChild>
              <Link to="/">До каталогу</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const unavailable = cart.items.filter((item) => !item.available)

  return (
    <div className="flex flex-col gap-10">
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <ul className="flex flex-col gap-3" aria-label="Товари в кошику">
          {cart.items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </ul>
        <div className="flex flex-col gap-3 lg:sticky lg:top-20">
          <CartSummary cart={cart}>
            {unavailable.length > 0 && (
              <Alert variant="destructive">
                <TriangleAlertIcon />
                <AlertDescription>
                  Видаліть товари, яких немає в наявності, щоб оформити замовлення.
                </AlertDescription>
              </Alert>
            )}
            {unavailable.length > 0 ? (
              <Button size="lg" disabled>
                Оформити замовлення
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/checkout">Оформити замовлення</Link>
              </Button>
            )}
          </CartSummary>
        </div>
      </div>
      <CartRecommendations />
    </div>
  )
}
