import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DestinationCard from '../components/DestinationCard'
import type { Destination } from '../types'

const mockDest: Destination = {
  id: 'maasai-mara',
  name: 'Maasai Mara National Reserve',
  description: 'Experience the world-famous Great Migration in one of Africa\'s most iconic wildlife reserves.',
  location: 'Narok County, Kenya',
  imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
  price: 350,
  category: 'SAFARI',
  rating: 4.9,
  reviewCount: 1240,
  featured: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('DestinationCard', () => {
  it('renders destination name', () => {
    render(
      <MemoryRouter>
        <DestinationCard destination={mockDest} />
      </MemoryRouter>
    )
    expect(screen.getByText('Maasai Mara National Reserve')).toBeInTheDocument()
  })

  it('renders location', () => {
    render(
      <MemoryRouter>
        <DestinationCard destination={mockDest} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Narok County, Kenya/)).toBeInTheDocument()
  })

  it('renders price', () => {
    render(
      <MemoryRouter>
        <DestinationCard destination={mockDest} />
      </MemoryRouter>
    )
    expect(screen.getByText('$350')).toBeInTheDocument()
  })

  it('shows featured badge for featured destinations', () => {
    render(
      <MemoryRouter>
        <DestinationCard destination={mockDest} />
      </MemoryRouter>
    )
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('shows rating', () => {
    render(
      <MemoryRouter>
        <DestinationCard destination={mockDest} />
      </MemoryRouter>
    )
    expect(screen.getByText(/4.9/)).toBeInTheDocument()
  })

  it('has explore link pointing to correct destination', () => {
    render(
      <MemoryRouter>
        <DestinationCard destination={mockDest} />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /explore/i })
    expect(link).toHaveAttribute('href', '/destinations/maasai-mara')
  })
})
