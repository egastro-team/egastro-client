import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { formatPrice, UNIT_LABELS } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { Product } from '../schemas'
import { ProductImage } from './product-image'

type ProductCardProps = {
  product: Product
  /** Search string of the current catalog view, so "Back" on the product page restores it. */
  backSearch?: string
  /** Slot for actions such as "add to cart" (provided by the cart feature). */
  action?: ReactNode
  /** Extra line under the price, e.g. recommendation reason. */
  footnote?: ReactNode
}

export function ProductCard({ product, backSearch, action, footnote }: ProductCardProps) {
  return (
    <article
      className={cn(
        'group/card relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground transition-shadow hover:shadow-md',
        !product.available && 'opacity-75',
      )}
    >
      <ProductImage
        src={product.imageUrl}
        alt={product.name}
        className="aspect-[4/3] w-full transition-transform"
      />
      {!product.available && (
        <Badge variant="destructive" className="absolute top-2 left-2">
          Немає в наявності
        </Badge>
      )}
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs text-muted-foreground">{product.categoryName}</p>
          <h3 className="line-clamp-2 leading-snug font-semibold">
            <Link
              to={`/products/${product.id}`}
              state={backSearch !== undefined ? { backSearch } : undefined}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
            >
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="flex items-baseline gap-1">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground">
            / {UNIT_LABELS[product.unitOfMeasure]}
          </span>
        </p>
        {footnote && <div className="relative z-10">{footnote}</div>}
        {/* Actions sit above the stretched link so they stay clickable. */}
        {action && <div className="relative z-10">{action}</div>}
      </div>
    </article>
  )
}
