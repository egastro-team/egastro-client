import { useSearchParams } from 'react-router'

import {
  DEFAULT_PRODUCT_SORT,
  PRODUCTS_PAGE_SIZE,
  productSortSchema,
  type ProductListParams,
  type ProductSort,
} from '../schemas'

function parsePositiveInt(value: string | null): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

/**
 * Catalog filters live in the URL (CONTRACT.md §11): `?category=&q=&sort=&page=`.
 * `page` in the URL is 1-based for people; the API is 0-based.
 */
export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = parsePositiveInt(searchParams.get('category'))
  const q = searchParams.get('q')?.trim() || undefined
  const sortParse = productSortSchema.safeParse(searchParams.get('sort'))
  const sort: ProductSort = sortParse.success ? sortParse.data : DEFAULT_PRODUCT_SORT
  const page = parsePositiveInt(searchParams.get('page')) ?? 1

  const apiParams: ProductListParams = {
    category,
    q,
    sort: sort === DEFAULT_PRODUCT_SORT ? undefined : sort,
    page: page - 1,
    size: PRODUCTS_PAGE_SIZE,
  }

  /** Builds a catalog search string; changing any filter resets to the first page. */
  function buildSearch(changes: {
    category?: number | null
    q?: string | null
    sort?: ProductSort
    page?: number
  }): string {
    const next = new URLSearchParams(searchParams)
    const resetPage = !('page' in changes)
    if ('category' in changes) {
      if (changes.category) next.set('category', String(changes.category))
      else next.delete('category')
    }
    if ('q' in changes) {
      const trimmed = changes.q?.trim()
      if (trimmed) next.set('q', trimmed)
      else next.delete('q')
    }
    if (changes.sort !== undefined) {
      if (changes.sort === DEFAULT_PRODUCT_SORT) next.delete('sort')
      else next.set('sort', changes.sort)
    }
    if (resetPage || !changes.page || changes.page <= 1) next.delete('page')
    else next.set('page', String(changes.page))
    const result = next.toString()
    return result ? `?${result}` : ''
  }

  function update(changes: Parameters<typeof buildSearch>[0]) {
    setSearchParams(new URLSearchParams(buildSearch(changes)))
  }

  return { category, q, sort, page, apiParams, buildSearch, update }
}
