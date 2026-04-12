import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '@/components/task/TaskForm'
import type { TaskDraft } from '@/types/task'

const noop = () => {}

describe('TaskForm', () => {
  it('renders with submit button disabled when title is empty', () => {
    render(<TaskForm onSubmit={noop} onCancel={noop} />)
    expect(screen.getByRole('button', { name: /save task/i })).toBeDisabled()
  })

  it('enables submit once title is filled', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={noop} onCancel={noop} />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Buy milk')
    expect(screen.getByRole('button', { name: /save task/i })).toBeEnabled()
  })

  it('submits a once task with correct shape', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={noop} />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Buy milk')
    await user.click(screen.getByRole('button', { name: /save task/i }))
    const draft: TaskDraft = onSubmit.mock.calls[0][0]
    expect(draft.kind).toBe('once')
    expect(draft.title).toBe('Buy milk')
  })

  it('switches to cyclic when Recurring is toggled', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={noop} onCancel={noop} />)
    await user.click(screen.getByRole('button', { name: /recurring/i }))
    expect(screen.getByText(/repeat every/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/due date/i)).not.toBeInTheDocument()
  })

  it('submits a cyclic task with correct recurAfterMinutes (2 hours → 120)', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={noop} />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Do laundry')
    await user.click(screen.getByRole('button', { name: /recurring/i }))
    const amountInput = screen.getByRole('spinbutton', { name: /repeat amount/i })
    fireEvent.change(amountInput, { target: { value: '2' } })
    // unit is hours by default
    await user.click(screen.getByRole('button', { name: /save task/i }))
    const draft: TaskDraft = onSubmit.mock.calls[0][0]
    expect(draft.kind).toBe('cyclic')
    if (draft.kind !== 'cyclic') return
    expect(draft.recurAfterMinutes).toBe(120)
  })

  it('adds a step that appears in the form', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={noop} onCancel={noop} />)
    await user.click(screen.getByRole('button', { name: /add step/i }))
    expect(screen.getByPlaceholderText(/step 1/i)).toBeInTheDocument()
  })

  it('removes a step when the remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={noop} onCancel={noop} />)
    await user.click(screen.getByRole('button', { name: /add step/i }))
    expect(screen.getByPlaceholderText(/step 1/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /remove step/i }))
    expect(screen.queryByPlaceholderText(/step 1/i)).not.toBeInTheDocument()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<TaskForm onSubmit={noop} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
