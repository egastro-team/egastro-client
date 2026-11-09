/** Page numbers to show: first, last, current ±1, with `null` for gaps. */
export function getPageItems(page: number, totalPages: number): (number | null)[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const items: (number | null)[] = []
  for (const p of sorted) {
    const last = items.at(-1)
    if (typeof last === 'number' && p - last > 1) items.push(null)
    items.push(p)
  }
  return items
}
