import { z } from 'zod'

import { productSchema } from '@/features/catalog'
import { idSchema, unitOfMeasureSchema } from '@/lib/api-schemas'

export const cartItemSchema = z.object({
  productId: idSchema,
  name: z.string(),
  imageUrl: z.string().optional(),
  unitPrice: z.number(),
  unitOfMeasure: unitOfMeasureSchema,
  quantity: z.number().int(),
  lineTotal: z.number(),
  available: z.boolean(),
})
export type CartItem = z.infer<typeof cartItemSchema>

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  /** Sum of quantities, not the number of distinct products. */
  totalQuantity: z.number().int(),
  totalAmount: z.number(),
})
export type Cart = z.infer<typeof cartSchema>

export const ruleMetricsSchema = z.object({
  support: z.number().optional(),
  confidence: z.number().optional(),
  lift: z.number().optional(),
})
export type RuleMetrics = z.infer<typeof ruleMetricsSchema>

export const recommendedProductSchema = z.object({
  product: productSchema,
  score: z.number().optional(),
  metrics: ruleMetricsSchema.optional(),
})
export type RecommendedProduct = z.infer<typeof recommendedProductSchema>

export const cartRecommendationsSchema = z.object({
  source: z.enum(['MODEL', 'FALLBACK']),
  items: z.array(recommendedProductSchema),
})
export type CartRecommendations = z.infer<typeof cartRecommendationsSchema>

export const CART_MAX_QUANTITY = 99
export const RECOMMENDATIONS_LIMIT = 3
export const RECOMMENDATIONS_PAGE_LIMIT = 12
