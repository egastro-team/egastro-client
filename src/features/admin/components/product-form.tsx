import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { useCategories, type Product } from '@/features/catalog'
import { FormErrorAlert } from '@/components/form/form-error-alert'
import { FormTextField } from '@/components/form/form-text-field'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { unitOfMeasureSchema } from '@/lib/api-schemas'
import { applyServerErrors } from '@/lib/apply-server-errors'
import { UNIT_LABELS } from '@/lib/format'

import { productFormSchema, type ProductFormInput, type ProductFormOutput } from '../schemas'

const UNIT_FULL_LABELS = {
  PIECE: 'Штука',
  KG: 'Кілограм',
  G: 'Грам',
  L: 'Літр',
  ML: 'Мілілітр',
  PACK: 'Упаковка',
} as const

type ProductFormProps = {
  product?: Product
  submitLabel: string
  isPending: boolean
  onSubmit: (values: ProductFormOutput, handlers: { onError: (error: unknown) => void }) => void
  onCancel: () => void
}

function toDefaults(product?: Product): ProductFormInput {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    categoryId: product ? String(product.categoryId) : '',
    price: product ? product.price.toFixed(2) : '',
    unitOfMeasure: product?.unitOfMeasure ?? 'PIECE',
    imageUrl: product?.imageUrl ?? '',
    available: product?.available ?? true,
  }
}

export function ProductForm({
  product,
  submitLabel,
  isPending,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const categories = useCategories()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toDefaults(product),
  })

  const handleSubmit = form.handleSubmit((values) => {
    setServerError(null)
    onSubmit(values, {
      onError: (error) =>
        setServerError(
          applyServerErrors(error, form.setError, [
            'name',
            'description',
            'categoryId',
            'price',
            'unitOfMeasure',
            'imageUrl',
            'available',
          ]),
        ),
    })
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-2xl flex-col gap-6">
      <FieldGroup>
        <FormTextField control={form.control} name="name" label="Назва" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="field-categoryId">Категорія</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={categories.isPending || categories.isError}
                >
                  <SelectTrigger
                    id="field-categoryId"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                  >
                    <SelectValue
                      placeholder={
                        categories.isError ? 'Не вдалося завантажити' : 'Оберіть категорію'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.data?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.data?.length === 0 && (
                  <FieldDescription>
                    Спершу створіть категорію в розділі «Категорії».
                  </FieldDescription>
                )}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="unitOfMeasure"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="field-unitOfMeasure">Одиниця виміру</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="field-unitOfMeasure"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOfMeasureSchema.options.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {UNIT_FULL_LABELS[unit]} ({UNIT_LABELS[unit]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <FormTextField
          control={form.control}
          name="price"
          label="Ціна, ₴"
          inputMode="decimal"
          placeholder="0.00"
          description="Ціна за одиницю виміру."
        />
        <FormTextField
          control={form.control}
          name="imageUrl"
          label="Посилання на фото (необовʼязково)"
          type="url"
          placeholder="https://…"
          description="Завантаження файлів не підтримується — лише URL зображення."
        />
        <FormTextField
          control={form.control}
          name="description"
          label="Опис (необовʼязково)"
          multiline
        />
        <Controller
          control={form.control}
          name="available"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Switch id="field-available" checked={field.value} onCheckedChange={field.onChange} />
              <FieldContent>
                <FieldLabel htmlFor="field-available">В наявності</FieldLabel>
                <FieldDescription>
                  Товар без наявності видно в каталозі, але його не можна додати в кошик.
                </FieldDescription>
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <FormErrorAlert message={serverError} />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? 'Зберігаємо…' : submitLabel}
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
      </div>
    </form>
  )
}
