import { getErrorMessage, getFieldErrors, translateApiMessage } from '@/lib/api-error'
import { apiError } from '@/test/api-error'

describe('api errors', () => {
  it('translates known backend messages', () => {
    expect(translateApiMessage('Cart is empty')).toBe('Кошик порожній')
    expect(translateApiMessage('Some products are unavailable: Milk, Bread')).toBe(
      'Деяких товарів немає в наявності: Milk, Bread',
    )
    expect(translateApiMessage('Something new')).toBe('Something new')
  })

  it('reads the message from an API error response', () => {
    expect(getErrorMessage(apiError(409, 'Product is currently unavailable'))).toBe(
      'Товару зараз немає в наявності',
    )
  })

  it('keeps the first message per field', () => {
    const error = apiError(400, 'Validation failed', [
      { field: 'password', message: 'Password must contain at least one digit' },
      { field: 'password', message: 'Second message' },
      { field: 'email', message: 'Invalid parameter value' },
    ])
    expect(getFieldErrors(error)).toEqual({
      password: 'Password must contain at least one digit',
      email: 'Некоректне значення',
    })
  })

  it('falls back for non-API errors', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('Щось пішло не так. Спробуйте ще раз.')
  })
})
