import { z } from 'zod'

/** Shared API primitives from CONTRACT.md §1–2. Feature-specific schemas live in each feature. */

export const idSchema = z.number().int()

export const roleSchema = z.enum(['USER', 'ADMIN'])
export type Role = z.infer<typeof roleSchema>

export const unitOfMeasureSchema = z.enum(['PIECE', 'KG', 'G', 'L', 'ML', 'PACK'])
export type UnitOfMeasure = z.infer<typeof unitOfMeasureSchema>

export const orderStatusSchema = z.enum(['NEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
export type OrderStatus = z.infer<typeof orderStatusSchema>

export const userSchema = z.object({
  id: idSchema,
  email: z.string(),
  role: roleSchema,
})
export type User = z.infer<typeof userSchema>

export function pageResponseSchema<T extends z.ZodType>(item: T) {
  return z.object({
    content: z.array(item),
    page: z.number().int(),
    size: z.number().int(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
  })
}
export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export const apiErrorSchema = z.object({
  timestamp: z.string().optional(),
  status: z.number().int(),
  message: z.string(),
  path: z.string().optional(),
  fieldErrors: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
})
export type ApiErrorBody = z.infer<typeof apiErrorSchema>
