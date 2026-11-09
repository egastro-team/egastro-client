import { Badge } from '@/components/ui/badge'

type AvailabilityBadgeProps = {
  available: boolean
}

export function AvailabilityBadge({ available }: AvailabilityBadgeProps) {
  return available ? (
    <Badge variant="secondary">В наявності</Badge>
  ) : (
    <Badge variant="destructive">Немає в наявності</Badge>
  )
}
