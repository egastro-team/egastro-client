import { productFormSchema, toProductRequest } from './schemas'

const valid = {
  name: ' Whole Milk ',
  description: '',
  categoryId: '2',
  price: '2,49',
  unitOfMeasure: 'L' as const,
  imageUrl: '',
  available: true,
}

describe('product form', () => {
  it('converts form strings into the API body', () => {
    const parsed = productFormSchema.parse(valid)
    expect(toProductRequest(parsed)).toEqual({
      name: 'Whole Milk',
      description: null,
      categoryId: 2,
      price: 2.49,
      unitOfMeasure: 'L',
      imageUrl: null,
      available: true,
    })
  })

  it.each(['0', '0.00', '-1', '1.999', 'abc', ''])('rejects price %s', (price) => {
    expect(productFormSchema.safeParse({ ...valid, price }).success).toBe(false)
  })

  it('requires an absolute http(s) image URL', () => {
    expect(productFormSchema.safeParse({ ...valid, imageUrl: 'milk.png' }).success).toBe(false)
    expect(
      productFormSchema.safeParse({ ...valid, imageUrl: 'https://example.com/milk.png' }).success,
    ).toBe(true)
  })

  it('rejects an empty name', () => {
    expect(productFormSchema.safeParse({ ...valid, name: '   ' }).success).toBe(false)
  })
})
