import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { PRODUCT_SORT_LABELS, productSortSchema, type ProductSort } from '../schemas'

type SortSelectProps = {
  value: ProductSort
  onChange: (sort: ProductSort) => void
  className?: string
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const parsed = productSortSchema.safeParse(next)
        if (parsed.success) onChange(parsed.data)
      }}
    >
      <SelectTrigger
        className={cn('h-9 w-full bg-card sm:w-52', className)}
        aria-label="Сортування"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {productSortSchema.options.map((option) => (
          <SelectItem key={option} value={option}>
            {PRODUCT_SORT_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
