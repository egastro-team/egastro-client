import { formatPrice, formatUnitPrice, pluralize } from '@/lib/format'

describe('format', () => {
  it('formats money with two decimals and the currency sign', () => {
    // Intl uses a narrow no-break space as the group separator in uk-UA.
    expect(formatPrice(2.5).replace(/\s/g, ' ')).toBe('2,50 ₴')
    expect(formatPrice(1234).replace(/\s/g, ' ')).toBe('1 234,00 ₴')
  })

  it('adds the unit to a unit price', () => {
    expect(formatUnitPrice(1.49, 'L').replace(/\s/g, ' ')).toBe('1,49 ₴ / л')
  })

  it.each([
    [1, 'товар'],
    [3, 'товари'],
    [5, 'товарів'],
    [11, 'товарів'],
    [21, 'товар'],
    [22, 'товари'],
    [112, 'товарів'],
  ])('pluralizes %i as %s', (count, expected) => {
    expect(pluralize(count, 'товар', 'товари', 'товарів')).toBe(expected)
  })
})
