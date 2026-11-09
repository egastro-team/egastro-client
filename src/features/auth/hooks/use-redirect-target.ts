import { useSearchParams } from 'react-router'

/** `?redirect=` target, accepted only for same-origin relative paths. */
export function useRedirectTarget(): string | null {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) return null
  return redirect
}

export function loginPathFor(location: { pathname: string; search: string }) {
  const target = `${location.pathname}${location.search}`
  return `/login?redirect=${encodeURIComponent(target)}`
}
