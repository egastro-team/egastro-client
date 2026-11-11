import { ShoppingCartIcon } from 'lucide-react'
import { Link } from 'react-router'

import { useSession } from '@/features/auth'
import { Button } from '@/components/ui/button'

import { useCart } from '../api/cart-api'

/** Header cart link with the total quantity badge. */
export function CartButton() {
  const { isAuthenticated } = useSession()
  const { data: cart } = useCart()
  const count = isAuthenticated ? (cart?.totalQuantity ?? 0) : 0
  const label = count > 0 ? `Кошик, товарів: ${count}` : 'Кошик'

  return (
    <Button variant="ghost" size="icon-lg" asChild className="relative rounded-full">
      <Link to="/cart" aria-label={label}>
        <ShoppingCartIcon />
        {count > 0 && (
          <span
            aria-hidden
            className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground"
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Link>
    </Button>
  )
}
