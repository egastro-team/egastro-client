import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartKeys } from '@/features/cart'
import { apiClient } from '@/lib/api-client'
import { getApiStatus } from '@/lib/api-error'

import {
  orderSchema,
  orderSummaryPageSchema,
  ORDERS_PAGE_SIZE,
  type CheckoutFormValues,
  type Order,
} from '../schemas'

export const orderKeys = {
  all: ['orders'] as const,
  list: (page: number) => [...orderKeys.all, 'list', page] as const,
  detail: (id: number) => [...orderKeys.all, 'detail', id] as const,
}

export async function placeOrder(values: CheckoutFormValues) {
  const { data } = await apiClient.post('/orders', {
    deliveryAddress: values.deliveryAddress,
    contactPhone: values.contactPhone,
    comment: values.comment || undefined,
  })
  return orderSchema.parse(data)
}

export async function fetchOrders(page: number) {
  const { data } = await apiClient.get('/orders', { params: { page, size: ORDERS_PAGE_SIZE } })
  return orderSummaryPageSchema.parse(data)
}

export async function fetchOrder(id: number) {
  const { data } = await apiClient.get(`/orders/${id}`)
  return orderSchema.parse(data)
}

export async function cancelOrder(id: number) {
  const { data } = await apiClient.post(`/orders/${id}/cancel`)
  return orderSchema.parse(data)
}

/** Checkout is not idempotent: never retried automatically (CONTRACT.md §8). */
export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: placeOrder,
    retry: false,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order)
      void queryClient.invalidateQueries({ queryKey: cartKeys.all })
      void queryClient.invalidateQueries({ queryKey: [...orderKeys.all, 'list'] })
    },
    onError: (error) => {
      // 409: empty cart or unavailable products — show the up-to-date cart.
      if (getApiStatus(error) === 409)
        void queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

export function useOrders(page: number) {
  return useQuery({
    queryKey: orderKeys.list(page),
    queryFn: () => fetchOrders(page),
    placeholderData: keepPreviousData,
  })
}

export function useOrder(id: number | null) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? -1),
    queryFn: () => fetchOrder(id ?? -1),
    enabled: id !== null,
    retry: (failureCount, error) => getApiStatus(error) !== 404 && failureCount < 1,
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (order: Order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order)
      void queryClient.invalidateQueries({ queryKey: [...orderKeys.all, 'list'] })
    },
    onError: (error, id) => {
      // 409: the status changed meanwhile — reload it.
      if (getApiStatus(error) === 409) {
        void queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
      }
    },
  })
}
