import { useState } from 'react'
import { ShoppingBasketIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type ProductImageProps = {
  src?: string
  alt: string
  className?: string
}

/** Product photo with a neutral placeholder for missing or broken image URLs. */
export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src ?? null)}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          {alt && <span className="sr-only">{alt}</span>}
          <ShoppingBasketIcon className="size-1/4 text-muted-foreground/60" aria-hidden />
        </div>
      )}
    </div>
  )
}
