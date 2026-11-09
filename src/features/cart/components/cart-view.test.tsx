import { screen, within } from '@testing-library/react'

import { apiClient } from '@/lib/api-client'
import { renderWithProviders, signIn } from '@/test/render'

import { CartView } from './cart-view'

const cart = {
  items: [
    {
      productId: 12,
      name: 'Whole Milk',
      unitPrice: 1.49,
      unitOfMeasure: 'L',
      quantity: 2,
      lineTotal: 2.98,
      available: true,
    },
  ],
  totalQuantity: 2,
  totalAmount: 2.98,
}

function mockGet(cartData: unknown) {
  return vi.spyOn(apiClient, 'get').mockImplementation(async (url: string) => {
    if (url === '/cart') return { data: cartData }
    return { data: { source: 'FALLBACK', items: [] } }
  })
}

describe('CartView', () => {
  beforeEach(() => signIn())

  it('shows the empty state', async () => {
    mockGet({ items: [], totalQuantity: 0, totalAmount: 0 })
    renderWithProviders(<CartView />)
    expect(await screen.findByText('Кошик порожній')).toBeInTheDocument()
  })

  it('changes quantity through the API and shows the server cart', async () => {
    mockGet(cart)
    const put = vi.spyOn(apiClient, 'put').mockResolvedValue({
      data: {
        ...cart,
        items: [{ ...cart.items[0], quantity: 3, lineTotal: 4.47 }],
        totalQuantity: 3,
        totalAmount: 4.47,
      },
    })
    const { user } = renderWithProviders(<CartView />)
    const row = (await screen.findByRole('link', { name: 'Whole Milk' })).closest('li')
    if (!row) throw new Error('cart row not found')
    await user.click(within(row).getByRole('button', { name: 'Збільшити кількість' }))

    expect(put).toHaveBeenCalledWith('/cart/items/12', { quantity: 3 })
    expect(await within(row).findByText('3')).toBeInTheDocument()
    expect(screen.getAllByText(/4,47/).length).toBeGreaterThan(0)
  })

  it('blocks checkout while the cart has unavailable items', async () => {
    mockGet({ ...cart, items: [{ ...cart.items[0], available: false }] })
    renderWithProviders(<CartView />)
    expect(
      await screen.findByText('Видаліть товари, яких немає в наявності, щоб оформити замовлення.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Оформити замовлення' })).toBeDisabled()
  })
})
