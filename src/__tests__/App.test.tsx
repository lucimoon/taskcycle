import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '@/App'

describe('App', () => {
  it('renders the TaskCycle heading', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('TaskCycle')).toBeInTheDocument()
  })
})
