import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { catalogKeys } from '@/features/catalog'
import { useSession } from '@/features/auth'
import { apiClient } from '@/lib/api-client'
import { getApiStatus } from '@/lib/api-error'

import { cartRecommendationsSchema, cartSchema, type Cart } from '../schemas'

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
  recommendations: (limit: number) => [...cartKeys.all, 'recommendations', limit] as const,
}

export async function fetchCart() {
  const { data } = await apiClient.get('/cart')
  return cartSchema.parse(data)
}

export async function addCartItem(input: { productId: number; quantity: number }) {
  const { data } = await apiClient.post('/cart/items', input)
  return cartSchema.parse(data)
}

export async function setCartItemQuantity(input: { productId: number; quantity: number }) {
  const { data } = await apiClient.put(`/cart/items/${input.productId}`, {
    quantity: input.quantity,
  })
  return cartSchema.parse(data)
}

export async function removeCartItem(productId: number) {
  const { data } = await apiClient.delete(`/cart/items/${productId}`)
  return cartSchema.parse(data)
}

export async function fetchCartRecommendations(limit: number) {
  const { data } = await apiClient.get('/cart/recommendations', { params: { limit } })
  return cartRecommendationsSchema.parse(data)
}

export function useCart() {
  const { isAuthenticated } = useSession()
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: fetchCart,
    enabled: isAuthenticated,
    staleTime: 30_000,
  })
}

/** Related products for the current cart. A separate query so a slow model never blocks the cart. */
export function useCartRecommendations(limit: number) {
  const { isAuthenticated } = useSession()
  return useQuery({
    queryKey: cartKeys.recommendations(limit),
    queryFn: () => fetchCartRecommendations(limit),
    enabled: isAuthenticated,
    staleTime: 30_000,
  })
}

/** Server cart is authoritative: replace the cached cart with the response and refresh related products. */
function useApplyCart() {
  const queryClient = useQueryClient()
  return (cart: Cart) => {
    queryClient.setQueryData(cartKeys.detail(), cart)
    void queryClient.invalidateQueries({ queryKey: [...cartKeys.all, 'recommendations'] })
  }
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const applyCart = useApplyCart()
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: applyCart,
    onError: (error) => {
      // 409 "unavailable" / 404 "not found": the catalog we showed is stale.
      const status = getApiStatus(error)
      if (status === 409 || status === 404) {
        void queryClient.invalidateQueries({ queryKey: catalogKeys.products() })
      }
    },
  })
}

function withQuantity(cart: Cart, productId: number, quantity: number): Cart {
  const items = cart.items.map((item) =>
    item.productId === productId
      ? { ...item, quantity, lineTotal: Math.round(item.unitPrice * quantity * 100) / 100 }
      : item,
  )
  return {
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100,
  }
}

/** Optimistic quantity change; the server response then replaces the estimate. */
export function useSetCartItemQuantity() {
  const queryClient = useQueryClient()
  const applyCart = useApplyCart()
  return useMutation({
    mutationFn: setCartItemQuantity,
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() })
      const previous = queryClient.getQueryData<Cart>(cartKeys.detail())
      if (previous) {
        queryClient.setQueryData(cartKeys.detail(), withQuantity(previous, productId, quantity))
      }
      return { previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(cartKeys.detail(), context.previous)
      void queryClient.invalidateQueries({ queryKey: cartKeys.detail() })
    },
    onSuccess: applyCart,
  })
}

export function useRemoveCartItem() {
  const applyCart = useApplyCart()
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: applyCart,
  })
}
