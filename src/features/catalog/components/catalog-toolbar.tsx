import { useState, type FormEvent } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { SEARCH_MAX_LENGTH, type ProductSort } from '../schemas'
import { SortSelect } from './sort-select'

type CatalogToolbarProps = {
  query?: string
  sort: ProductSort
  onSearch: (query: string) => void
  onSortChange: (sort: ProductSort) => void
}

export function CatalogToolbar({ query, sort, onSearch, onSortChange }: CatalogToolbarProps) {
  // Keyed by `query` in the parent so it resets when the URL changes.
  const [draft, setDraft] = useState(query ?? '')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(draft)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <label htmlFor="catalog-search" className="sr-only">
            Пошук товарів
          </label>
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="catalog-search"
            type="search"
            value={draft}
            maxLength={SEARCH_MAX_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Пошук товарів…"
            className="h-9 pr-8 pl-8"
          />
          {draft && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Очистити пошук"
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={() => {
                setDraft('')
                onSearch('')
              }}
            >
              <XIcon />
            </Button>
          )}
        </div>
        <Button type="submit" size="lg">
          Знайти
        </Button>
      </form>
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
  )
}
