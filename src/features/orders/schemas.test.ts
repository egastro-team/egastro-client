import { checkoutFormSchema, normalizePhone } from './schemas'

describe('checkout form', () => {
  it('normalizes phones like the backend', () => {
    expect(normalizePhone('+380 (67) 123-45-67')).toBe('+380671234567')
  })

  it.each(['+380 (67) 123-45-67', '0671234567', '+12345678901234'])('accepts %s', (phone) => {
    const result = checkoutFormSchema.safeParse({
      deliveryAddress: 'Kyiv',
      contactPhone: phone,
      comment: '',
    })
    expect(result.success).toBe(true)
  })

  it.each(['12345', '+38 067 abc 45 67', '+1234567890123456'])('rejects %s', (phone) => {
    const result = checkoutFormSchema.safeParse({
      deliveryAddress: 'Kyiv',
      contactPhone: phone,
      comment: '',
    })
    expect(result.success).toBe(false)
  })
})
