import { screen } from '@testing-library/react'

import { apiClient } from '@/lib/api-client'
import { renderWithProviders, signIn } from '@/test/render'

import { CartRecommendations } from './cart-recommendations'

const bread = {
  id: 101,
  name: 'Bread',
  price: 1.5,
  unitOfMeasure: 'PIECE',
  available: true,
  categoryId: 4,
  categoryName: 'Bakery',
}

describe('CartRecommendations', () => {
  beforeEach(() => signIn())

  it('shows model results with the association-rule reason', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: {
        source: 'MODEL',
        items: [{ product: bread, score: 0.41, metrics: { confidence: 0.41, lift: 3.42 } }],
      },
    })
    renderWithProviders(<CartRecommendations limit={4} />)
    expect(await screen.findByRole('heading', { name: 'Часто купують разом' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Bread' })).toBeInTheDocument()
    expect(screen.getByText(/41\s?% беруть разом/)).toBeInTheDocument()
    expect(get).toHaveBeenCalledWith('/cart/recommendations', { params: { limit: 4 } })
  })

  it('labels fallback results as popular and hides metrics', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { source: 'FALLBACK', items: [{ product: bread }] },
    })
    renderWithProviders(<CartRecommendations />)
    expect(await screen.findByRole('heading', { name: 'Популярне' })).toBeInTheDocument()
    expect(screen.queryByText(/беруть разом/)).not.toBeInTheDocument()
  })

  it('renders nothing for an empty result', async () => {
    const get = vi
      .spyOn(apiClient, 'get')
      .mockResolvedValue({ data: { source: 'MODEL', items: [] } })
    const { container } = renderWithProviders(<CartRecommendations />)
    await vi.waitFor(() => expect(get).toHaveBeenCalled())
    await vi.waitFor(() => expect(container).toBeEmptyDOMElement())
  })
})
