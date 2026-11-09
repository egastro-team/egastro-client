import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/render'

import type { Product } from '../schemas'
import { ProductCard } from './product-card'

const milk: Product = {
  id: 12,
  name: 'Whole Milk',
  price: 1.49,
  unitOfMeasure: 'L',
  available: true,
  categoryId: 1,
  categoryName: 'Dairy',
}

describe('ProductCard', () => {
  it('shows name, category, price and links to the product page', async () => {
    renderWithProviders(<ProductCard product={milk} />)
    const link = await screen.findByRole('link', { name: 'Whole Milk' })
    expect(link).toHaveAttribute('href', '/products/12')
    expect(screen.getByText('Dairy')).toBeInTheDocument()
    expect(screen.getByText(/1,49/)).toBeInTheDocument()
    expect(screen.queryByText('Немає в наявності')).not.toBeInTheDocument()
  })

  it('marks unavailable products', async () => {
    renderWithProviders(<ProductCard product={{ ...milk, available: false }} />)
    expect(await screen.findByText('Немає в наявності')).toBeInTheDocument()
  })
})
