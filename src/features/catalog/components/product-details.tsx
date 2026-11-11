import type { ReactNode } from 'react'

import { formatPrice, UNIT_LABELS } from '@/lib/format'

import type { Product } from '../schemas'
import { AvailabilityBadge } from './availability-badge'
import { ProductImage } from './product-image'

type ProductDetailsProps = {
  product: Product
  action?: ReactNode
}

export function ProductDetails({ product, action }: ProductDetailsProps) {
  return (
    <article className="grid gap-6 rounded-2xl border bg-card p-4 sm:p-6 md:grid-cols-2 md:gap-10">
      <ProductImage
        src={product.imageUrl}
        alt={product.name}
        className="aspect-[4/3] w-full rounded-2xl border"
      />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{product.categoryName}</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <AvailabilityBadge available={product.available} />
        </div>
        <p className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
          <span className="text-muted-foreground">за {UNIT_LABELS[product.unitOfMeasure]}</span>
        </p>
        {action}
        <section className="flex flex-col gap-2">
          <h2 className="font-medium">Опис</h2>
          <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
            {product.description || 'Опис відсутній.'}
          </p>
        </section>
      </div>
    </article>
  )
}
