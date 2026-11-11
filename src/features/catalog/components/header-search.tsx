import { useState, type FormEvent } from 'react'
import { SearchIcon } from 'lucide-react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import { Input } from '@/components/ui/input'

import { SEARCH_MAX_LENGTH } from '../schemas'

/** Product search in the site header (Figma wireframe). Submitting opens the catalog with `?q=`. */
export function HeaderSearch() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const onCatalog = location.pathname === '/'
  const currentQuery = onCatalog ? (searchParams.get('q') ?? '') : ''
  return <HeaderSearchForm key={currentQuery} initialQuery={currentQuery} onCatalog={onCatalog} />
}

type HeaderSearchFormProps = {
  initialQuery: string
  onCatalog: boolean
}

function HeaderSearchForm({ initialQuery, onCatalog }: HeaderSearchFormProps) {
  const [draft, setDraft] = useState(initialQuery)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // On the catalog keep the chosen category/sort; elsewhere start a fresh search.
    const next = onCatalog ? new URLSearchParams(searchParams) : new URLSearchParams()
    next.delete('page')
    const query = draft.trim()
    if (query) next.set('q', query)
    else next.delete('q')
    const search = next.toString()
    navigate(search ? `/?${search}` : '/')
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor="header-search" className="sr-only">
        Пошук товарів
      </label>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="header-search"
        type="search"
        value={draft}
        maxLength={SEARCH_MAX_LENGTH}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Пошук товарів..."
        className="h-10 rounded-full bg-muted pl-9 dark:bg-input/30"
      />
    </form>
  )
}
