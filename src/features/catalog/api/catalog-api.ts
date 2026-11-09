import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { apiClient } from '@/lib/api-client'
import { getApiStatus } from '@/lib/api-error'

import {
  categorySchema,
  productPageSchema,
  productSchema,
  type ProductListParams,
} from '../schemas'

export const catalogKeys = {
  all: ['catalog'] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  products: () => [...catalogKeys.all, 'products'] as const,
  productList: (params: ProductListParams) => [...catalogKeys.products(), 'list', params] as const,
  product: (id: number) => [...catalogKeys.products(), 'detail', id] as const,
}

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories')
  return z.array(categorySchema).parse(data)
}

export async function fetchProducts(params: ProductListParams) {
  const { data } = await apiClient.get('/products', {
    // Omitted params use backend defaults; `sort=` (empty) would be a 400.
    params: {
      category: params.category,
      q: params.q?.trim() || undefined,
      sort: params.sort,
      page: params.page,
      size: params.size,
    },
  })
  return productPageSchema.parse(data)
}

export async function fetchProduct(id: number) {
  const { data } = await apiClient.get(`/products/${id}`)
  return productSchema.parse(data)
}

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: catalogKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  })

export const productsQueryOptions = (params: ProductListParams) =>
  queryOptions({
    queryKey: catalogKeys.productList(params),
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  })

export const productQueryOptions = (id: number) =>
  queryOptions({
    queryKey: catalogKeys.product(id),
    queryFn: () => fetchProduct(id),
    // A 404 will not fix itself on retry.
    retry: (failureCount, error) => getApiStatus(error) !== 404 && failureCount < 1,
  })

export function useCategories() {
  return useQuery(categoriesQueryOptions())
}

export function useProducts(params: ProductListParams) {
  return useQuery(productsQueryOptions(params))
}

export function useProduct(id: number | null) {
  return useQuery({ ...productQueryOptions(id ?? -1), enabled: id !== null })
}
