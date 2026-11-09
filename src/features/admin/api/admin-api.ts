import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartKeys } from '@/features/cart'
import { catalogKeys, categorySchema, productSchema } from '@/features/catalog'
import { orderKeys } from '@/features/orders'
import { apiClient } from '@/lib/api-client'
import type { OrderStatus } from '@/lib/api-schemas'

import {
  ADMIN_ORDERS_PAGE_SIZE,
  adminOrderSchema,
  adminOrderSummaryPageSchema,
  toProductRequest,
  type ProductFormOutput,
} from '../schemas'

export const adminKeys = {
  all: ['admin'] as const,
  orders: () => [...adminKeys.all, 'orders'] as const,
  orderList: (params: { status?: OrderStatus; page: number; size: number }) =>
    [...adminKeys.orders(), 'list', params] as const,
  order: (id: number) => [...adminKeys.orders(), 'detail', id] as const,
}

// ---------- Products ----------

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: ProductFormOutput) => {
      const { data } = await apiClient.post('/admin/products', toProductRequest(values))
      return productSchema.parse(data)
    },
    onSuccess: (product) => {
      queryClient.setQueryData(catalogKeys.product(product.id), product)
      void queryClient.invalidateQueries({ queryKey: catalogKeys.products() })
    },
  })
}

export function useReplaceProduct(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: ProductFormOutput) => {
      const { data } = await apiClient.put(`/admin/products/${id}`, toProductRequest(values))
      return productSchema.parse(data)
    },
    onSuccess: (product) => {
      queryClient.setQueryData(catalogKeys.product(product.id), product)
      void queryClient.invalidateQueries({ queryKey: catalogKeys.products() })
      // Cart lines show current catalog names/prices.
      void queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/products/${id}`)
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: catalogKeys.product(id) })
      void queryClient.invalidateQueries({ queryKey: catalogKeys.products() })
      void queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

// ---------- Categories ----------

function useInvalidateCatalog() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: catalogKeys.categories() })
    void queryClient.invalidateQueries({ queryKey: catalogKeys.products() })
  }
}

export function useCreateCategory() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiClient.post('/admin/categories', { name })
      return categorySchema.parse(data)
    },
    onSuccess: invalidate,
  })
}

export function useRenameCategory() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const { data } = await apiClient.put(`/admin/categories/${id}`, { name })
      return categorySchema.parse(data)
    },
    onSuccess: invalidate,
  })
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/categories/${id}`)
    },
    onSuccess: invalidate,
  })
}

// ---------- Orders ----------

export function useAdminOrders(params: { status?: OrderStatus; page: number; size?: number }) {
  const full = { ...params, size: params.size ?? ADMIN_ORDERS_PAGE_SIZE }
  return useQuery({
    queryKey: adminKeys.orderList(full),
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/orders', { params: full })
      return adminOrderSummaryPageSchema.parse(data)
    },
    placeholderData: keepPreviousData,
  })
}

export function useAdminOrder(id: number | null) {
  return useQuery({
    queryKey: adminKeys.order(id ?? -1),
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/orders/${id}`)
      return adminOrderSchema.parse(data)
    },
    enabled: id !== null,
  })
}

export function useChangeOrderStatus(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (status: OrderStatus) => {
      const { data } = await apiClient.patch(`/admin/orders/${id}/status`, { status })
      return adminOrderSchema.parse(data)
    },
    onSuccess: (order) => {
      queryClient.setQueryData(adminKeys.order(id), order)
      void queryClient.invalidateQueries({ queryKey: [...adminKeys.orders(), 'list'] })
      void queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.order(id) })
    },
  })
}
