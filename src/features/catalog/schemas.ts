import { z } from 'zod'

import { idSchema, pageResponseSchema, unitOfMeasureSchema } from '@/lib/api-schemas'

export const categorySchema = z.object({
  id: idSchema,
  name: z.string(),
})
export type Category = z.infer<typeof categorySchema>

export const productSchema = z.object({
  id: idSchema,
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  unitOfMeasure: unitOfMeasureSchema,
  imageUrl: z.string().optional(),
  available: z.boolean(),
  categoryId: idSchema,
  categoryName: z.string(),
})
export type Product = z.infer<typeof productSchema>

export const productPageSchema = pageResponseSchema(productSchema)

export const productSortSchema = z.enum(['name_asc', 'name_desc', 'price_asc', 'price_desc'])
export type ProductSort = z.infer<typeof productSortSchema>

export const DEFAULT_PRODUCT_SORT: ProductSort = 'name_asc'
export const PRODUCTS_PAGE_SIZE = 20
export const SEARCH_MAX_LENGTH = 100

export const PRODUCT_SORT_LABELS: Record<ProductSort, string> = {
  name_asc: 'За назвою: А–Я',
  name_desc: 'За назвою: Я–А',
  price_asc: 'Спочатку дешевші',
  price_desc: 'Спочатку дорожчі',
}

/** Params of GET /api/products. `page` is zero-based like the API. */
export type ProductListParams = {
  category?: number
  q?: string
  sort?: ProductSort
  page: number
  size: number
}
