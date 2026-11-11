import { Link } from 'react-router'

import { BrandName } from './brand-name'

export function Logo() {
  return (
    <Link
      to="/"
      aria-label="єГастро — на головну"
      className="shrink-0 rounded-md text-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <BrandName />
    </Link>
  )
}
