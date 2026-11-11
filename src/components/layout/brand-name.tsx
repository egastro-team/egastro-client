import { cn } from '@/lib/utils'

type BrandNameProps = {
  className?: string
}

/** "єГастро" wordmark from the Figma mockups: "є" in text colour, "Гастро" in the brand orange. */
export function BrandName({ className }: BrandNameProps) {
  return (
    <span className={cn('font-heading font-bold tracking-tight', className)}>
      є<span className="text-primary">Гастро</span>
    </span>
  )
}
