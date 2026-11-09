import type { OrderStatus, UnitOfMeasure } from '@/lib/api-schemas'

/** Currency sign for display only: the API sends plain numbers without a currency (CONTRACT.md §1). */
export const CURRENCY_SYMBOL = '₴'

const priceFormatter = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} ${CURRENCY_SYMBOL}`
}

const dateTimeFormatter = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dateTimeFormatter.format(date)
}

export const UNIT_LABELS: Record<UnitOfMeasure, string> = {
  PIECE: 'шт',
  KG: 'кг',
  G: 'г',
  L: 'л',
  ML: 'мл',
  PACK: 'уп',
}

/** "1,49 ₴ / л" */
export function formatUnitPrice(price: number, unit: UnitOfMeasure): string {
  return `${formatPrice(price)} / ${UNIT_LABELS[unit]}`
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Нове',
  CONFIRMED: 'Підтверджене',
  COMPLETED: 'Виконане',
  CANCELLED: 'Скасоване',
}

export function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
