import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/api-error'

import { useCancelOrder } from '../api/orders-api'

type CancelOrderButtonProps = {
  orderId: number
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const cancel = useCancelOrder()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={cancel.isPending}>
          {cancel.isPending ? 'Скасовуємо…' : 'Скасувати замовлення'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Скасувати замовлення №{orderId}?</AlertDialogTitle>
          <AlertDialogDescription>
            Товари не повернуться в кошик автоматично. Цю дію не можна відмінити.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ні, залишити</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() =>
              cancel.mutate(orderId, {
                onSuccess: () => toast.success(`Замовлення №${orderId} скасовано`),
                onError: (error) => toast.error(getErrorMessage(error)),
              })
            }
          >
            Так, скасувати
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
