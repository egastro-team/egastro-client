import { RotateCcwIcon, TriangleAlertIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/api-error'

type ErrorStateProps = {
  error: unknown
  title?: string
  onRetry?: () => void
}

export function ErrorState({
  error,
  title = 'Не вдалося завантажити дані',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center"
    >
      <TriangleAlertIcon className="size-8 text-destructive" aria-hidden />
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCcwIcon />
          Спробувати ще раз
        </Button>
      )}
    </div>
  )
}
