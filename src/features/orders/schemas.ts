import { z } from 'zod'

import { idSchema, orderStatusSchema, pageResponseSchema } from '@/lib/api-schemas'

export const orderItemSchema = z.object({
  /** Snapshot reference: the catalog product may have been changed or deleted since. */
  productId: idSchema,
  productName: z.string(),
  unitPrice: z.number(),
  quantity: z.number().int(),
  lineTotal: z.number(),
})
export type OrderItem = z.infer<typeof orderItemSchema>

export const orderSchema = z.object({
  id: idSchema,
  status: orderStatusSchema,
  totalAmount: z.number(),
  deliveryAddress: z.string(),
  contactPhone: z.string(),
  comment: z.string().optional(),
  createdAt: z.string(),
  items: z.array(orderItemSchema),
})
export type Order = z.infer<typeof orderSchema>

export const orderSummarySchema = z.object({
  id: idSchema,
  status: orderStatusSchema,
  totalAmount: z.number(),
  /** Sum of item quantities. */
  itemsCount: z.number().int(),
  createdAt: z.string(),
})
export type OrderSummary = z.infer<typeof orderSummarySchema>

export const orderSummaryPageSchema = pageResponseSchema(orderSummarySchema)

export const ORDERS_PAGE_SIZE = 10

/** Same normalization as the backend: drop spaces, parentheses and hyphens. */
export function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, '')
}

export const checkoutFormSchema = z.object({
  deliveryAddress: z
    .string()
    .trim()
    .min(1, 'Вкажіть адресу доставки')
    .max(500, 'Адреса має містити не більше 500 символів'),
  contactPhone: z
    .string()
    .trim()
    .min(1, 'Вкажіть номер телефону')
    .refine(
      (value) => /^\+?[0-9]{10,15}$/.test(normalizePhone(value)),
      'Номер має містити 10–15 цифр, наприклад +380 67 123 45 67',
    ),
  comment: z.string().trim().max(1000, 'Коментар має містити не більше 1000 символів'),
})
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
