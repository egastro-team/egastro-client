import { useState } from 'react'
import { CheckIcon, ShoppingCartIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { loginPathFor, useSession } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/api-error'

import { useAddToCart, useCart } from '../api/cart-api'
import { CART_MAX_QUANTITY } from '../schemas'
import { QuantityStepper } from './quantity-stepper'

type AddToCartButtonProps = {
  productId: number
  productName: string
  available: boolean
  /** Full variant with a quantity picker (product page); compact icon button otherwise. */
  variant?: 'compact' | 'full'
}

export function AddToCartButton({
  productId,
  productName,
  available,
  variant = 'compact',
}: AddToCartButtonProps) {
  const { isAuthenticated } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const addToCart = useAddToCart()
  const { data: cart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const inCart = cart?.items.find((item) => item.productId === productId)?.quantity ?? 0
  const maxToAdd = Math.max(0, CART_MAX_QUANTITY - inCart)

  function handleAdd() {
    if (!isAuthenticated) {
      toast.info('Увійдіть, щоб додавати товари в кошик')
      navigate(loginPathFor(location))
      return
    }
    const amount = variant === 'full' ? quantity : 1
    addToCart.mutate(
      { productId, quantity: amount },
      {
        onSuccess: () => {
          setQuantity(1)
          toast.success(`«${productName}» додано в кошик`, {
            action: { label: 'До кошика', onClick: () => navigate('/cart') },
          })
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  if (!available) {
    return (
      <Button
        variant="outline"
        disabled
        size="lg"
        className={variant === 'compact' ? 'h-9 w-full rounded-full' : 'h-10'}
      >
        Немає в наявності
      </Button>
    )
  }

  if (variant === 'compact') {
    return (
      <Button
        size="lg"
        className="h-9 w-full rounded-full"
        onClick={handleAdd}
        disabled={addToCart.isPending || (isAuthenticated && maxToAdd === 0)}
        aria-label={`Додати «${productName}» в кошик`}
      >
        {addToCart.isSuccess && !addToCart.isPending ? <CheckIcon /> : <ShoppingCartIcon />}
        {addToCart.isSuccess && !addToCart.isPending ? 'У кошику' : 'У кошик'}
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          label="Кількість"
          value={quantity}
          onChange={setQuantity}
          max={Math.max(1, maxToAdd)}
          disabled={addToCart.isPending || maxToAdd === 0}
          className="h-10 [&_button]:size-10"
        />
        <Button
          size="lg"
          className="h-10 flex-1 sm:flex-none sm:px-6"
          onClick={handleAdd}
          disabled={addToCart.isPending || (isAuthenticated && maxToAdd === 0)}
        >
          <ShoppingCartIcon />
          {addToCart.isPending ? 'Додаємо…' : 'Додати в кошик'}
        </Button>
      </div>
      {inCart > 0 && (
        <p className="text-sm text-muted-foreground">
          У кошику вже {inCart}
          {maxToAdd === 0 && ' — це максимальна кількість'}
        </p>
      )}
    </div>
  )
}
