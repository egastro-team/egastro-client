import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { FormErrorAlert } from '@/components/form/form-error-alert'
import { FormTextField } from '@/components/form/form-text-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { applyServerErrors } from '@/lib/apply-server-errors'

import { usePlaceOrder } from '../api/orders-api'
import { checkoutFormSchema, type CheckoutFormValues } from '../schemas'

type CheckoutFormProps = {
  disabled?: boolean
}

export function CheckoutForm({ disabled = false }: CheckoutFormProps) {
  const navigate = useNavigate()
  const placeOrder = usePlaceOrder()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { deliveryAddress: '', contactPhone: '', comment: '' },
  })

  const onSubmit = form.handleSubmit((values) => {
    setServerError(null)
    placeOrder.mutate(values, {
      onSuccess: (order) => {
        toast.success(`Замовлення №${order.id} оформлено!`)
        navigate(`/orders/${order.id}`, { replace: true })
      },
      onError: (error) =>
        setServerError(
          applyServerErrors(error, form.setError, ['deliveryAddress', 'contactPhone', 'comment']),
        ),
    })
  })

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-6 rounded-2xl border bg-card p-4 sm:p-6"
    >
      <FieldGroup>
        <FormTextField
          control={form.control}
          name="deliveryAddress"
          label="Адреса доставки"
          autoComplete="street-address"
          placeholder="м. Київ, вул. Хрещатик, 1, кв. 10"
        />
        <FormTextField
          control={form.control}
          name="contactPhone"
          label="Телефон"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+380 67 123 45 67"
        />
        <FormTextField
          control={form.control}
          name="comment"
          label="Коментар (необовʼязково)"
          placeholder="Наприклад: зателефонуйте за 10 хвилин"
          multiline
        />
      </FieldGroup>
      <FormErrorAlert message={serverError} />
      <p className="text-sm text-muted-foreground">
        Онлайн-оплата не передбачена. Ціни та сума фіксуються в момент оформлення.
      </p>
      <Button type="submit" size="lg" disabled={disabled || placeOrder.isPending}>
        {placeOrder.isPending ? 'Оформлюємо…' : 'Підтвердити замовлення'}
      </Button>
    </form>
  )
}
