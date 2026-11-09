import { MinusIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { CART_MAX_QUANTITY } from '../schemas'

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  label: string
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = CART_MAX_QUANTITY,
  disabled = false,
  label,
  className,
}: QuantityStepperProps) {
  return (
    <fieldset className={cn('inline-flex items-center rounded-lg border', className)}>
      <legend className="sr-only">{label}</legend>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Зменшити кількість"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon />
      </Button>
      <output aria-live="polite" className="min-w-8 text-center text-sm font-medium tabular-nums">
        {value}
      </output>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Збільшити кількість"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon />
      </Button>
    </fieldset>
  )
}
