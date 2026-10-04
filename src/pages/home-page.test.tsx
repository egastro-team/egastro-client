import { render, screen } from '@testing-library/react'

import { HomePage } from '@/pages/home-page'

describe('HomePage', () => {
  it('renders the app title', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: 'Egastro' })).toBeInTheDocument()
  })
})
