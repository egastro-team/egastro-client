import axios from 'axios'

import { apiErrorSchema, type ApiErrorBody } from '@/lib/api-schemas'

/** Backend messages (CONTRACT.md) translated for the Ukrainian UI. Unknown messages are shown as is. */
const MESSAGE_TRANSLATIONS: Record<string, string> = {
  'Incorrect email or password': 'Невірний email або пароль',
  'A user with this email already exists': 'Користувач з таким email уже існує',
  'Authentication required': 'Потрібно увійти в акаунт',
  'Access denied': 'Доступ заборонено',
  'User not found': 'Користувача не знайдено',
  'Category not found': 'Категорію не знайдено',
  'Product not found': 'Товар не знайдено',
  'Order not found': 'Замовлення не знайдено',
  'Item not found in cart': 'Товару немає в кошику',
  'Resource not found': 'Ресурс не знайдено',
  'A category with this name already exists': 'Категорія з такою назвою вже існує',
  'Category contains products and cannot be deleted':
    'Категорія містить товари, тому її не можна видалити',
  'Category does not exist': 'Такої категорії не існує',
  'Product is currently unavailable': 'Товару зараз немає в наявності',
  'Maximum quantity per product is 99': 'Максимальна кількість одного товару — 99',
  'Cart is empty': 'Кошик порожній',
  'Order can no longer be cancelled': 'Замовлення вже не можна скасувати',
  'Validation failed': 'Перевірте правильність заповнення полів',
  'Malformed request body': 'Некоректний запит',
  'Method not allowed': 'Дію не підтримано',
  'Data conflict': 'Конфлікт даних',
  'Unexpected error': 'Неочікувана помилка сервера',
  'Invalid parameter value': 'Некоректне значення',
  'Invalid product sort value': 'Некоректне сортування',
}

const PREFIX_TRANSLATIONS: [prefix: string, translate: (rest: string) => string][] = [
  ['Some products are unavailable: ', (rest) => `Деяких товарів немає в наявності: ${rest}`],
  ['Order already has status ', (rest) => `Замовлення вже має статус ${rest}`],
  ['Cannot change status of a ', (rest) => `Неможливо змінити статус замовлення (${rest})`],
]

export function translateApiMessage(message: string): string {
  const exact = MESSAGE_TRANSLATIONS[message]
  if (exact) return exact
  for (const [prefix, translate] of PREFIX_TRANSLATIONS) {
    if (message.startsWith(prefix)) return translate(message.slice(prefix.length))
  }
  return message
}

/** Parsed backend error body, or null for network errors and non-API failures. */
export function getApiError(error: unknown): ApiErrorBody | null {
  if (!axios.isAxiosError(error) || !error.response) return null
  const parsed = apiErrorSchema.safeParse(error.response.data)
  if (parsed.success) return parsed.data
  return { status: error.response.status, message: '' }
}

export function getApiStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? (error.response?.status ?? null) : null
}

/** A user-facing Ukrainian message for any thrown error. */
export function getErrorMessage(error: unknown, fallback = 'Щось пішло не так. Спробуйте ще раз.') {
  if (axios.isAxiosError(error) && !error.response) {
    return 'Немає зʼєднання із сервером. Перевірте інтернет і спробуйте ще раз.'
  }
  const apiError = getApiError(error)
  if (apiError?.message) return translateApiMessage(apiError.message)
  return fallback
}

/** Field errors keyed by field name (first message per field), translated. */
export function getFieldErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {}
  for (const { field, message } of getApiError(error)?.fieldErrors ?? []) {
    result[field] ??= translateApiMessage(message)
  }
  return result
}
