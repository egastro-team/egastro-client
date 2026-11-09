import { z } from 'zod'

import { orderSchema, orderSummarySchema } from '@/features/orders'
import {
  idSchema,
  orderStatusSchema,
  pageResponseSchema,
  unitOfMeasureSchema,
  type OrderStatus,
} from '@/lib/api-schemas'

// ---------- Products ----------

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Вкажіть назву')
    .max(255, 'Назва має містити не більше 255 символів'),
  description: z.string().trim().max(5000, 'Опис має містити не більше 5000 символів'),
  categoryId: z
    .string()
    .min(1, 'Оберіть категорію')
    .transform((value) => Number(value)),
  price: z
    .string()
    .trim()
    .min(1, 'Вкажіть ціну')
    .regex(/^\d{1,10}([.,]\d{1,2})?$/, 'Ціна — число з не більше ніж двома знаками після коми')
    .transform((value) => Number(value.replace(',', '.')))
    .refine((value) => value > 0, 'Ціна має бути більшою за 0'),
  unitOfMeasure: unitOfMeasureSchema,
  imageUrl: z
    .string()
    .trim()
    .max(1000, 'Посилання задовге')
    .refine(
      (value) => value === '' || /^https?:\/\/\S+$/i.test(value),
      'Вкажіть повне посилання, що починається з http:// або https://',
    ),
  available: z.boolean(),
})
export type ProductFormInput = z.input<typeof productFormSchema>
export type ProductFormOutput = z.output<typeof productFormSchema>

/** Body of POST/PUT product. PUT is a full replacement, so every field is always sent. */
export function toProductRequest(values: ProductFormOutput) {
  return {
    name: values.name,
    description: values.description || null,
    categoryId: values.categoryId,
    price: values.price,
    unitOfMeasure: values.unitOfMeasure,
    imageUrl: values.imageUrl || null,
    available: values.available,
  }
}

// ---------- Categories ----------

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Вкажіть назву')
    .max(100, 'Назва має містити не більше 100 символів'),
})
export type CategoryFormValues = z.infer<typeof categoryFormSchema>

// ---------- Orders ----------

export const adminOrderSchema = orderSchema.extend({
  userId: idSchema,
  userEmail: z.string(),
})
export type AdminOrder = z.infer<typeof adminOrderSchema>

export const adminOrderSummarySchema = orderSummarySchema.extend({
  userId: idSchema,
  userEmail: z.string(),
})
export const adminOrderSummaryPageSchema = pageResponseSchema(adminOrderSummarySchema)

export const ADMIN_ORDERS_PAGE_SIZE = 20

/** Allowed manual transitions (CONTRACT.md §9). COMPLETED and CANCELLED are final. */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
  CONFIRMED: ['NEW', 'COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

export { orderStatusSchema }
