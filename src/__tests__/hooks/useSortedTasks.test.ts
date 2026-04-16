import { renderHook } from '@testing-library/react'
import { useSortedTasks } from '@/hooks/useSortedTasks'
import type { Task } from '@/types/task'

const tasks: Task[] = [
  {
    id: 'a', kind: 'once', title: 'A', steps: [], priority: 3, urgency: 1,
    estimatedMinutes: 30, createdAt: '2024-01-03T00:00:00Z',
    dueAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'b', kind: 'cyclic', title: 'B', steps: [], priority: 1, urgency: 3,
    estimatedMinutes: 5, createdAt: '2024-01-01T00:00:00Z',
    recurAfterMinutes: 60, nextDueAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'c', kind: 'once', title: 'C', steps: [], priority: 2, urgency: 2,
    estimatedMinutes: undefined, createdAt: '2024-01-02T00:00:00Z',
    dueAt: '2024-02-01T10:00:00Z',
  },
]

describe('useSortedTasks', () => {
  it('default sort — preserves insertion order', () => {
    const { result } = renderHook(() => useSortedTasks(tasks, 'default'))
    expect(result.current.map((t) => t.id)).toEqual(['a', 'b', 'c'])
  })

  it('priority sort — ascending (1 = highest)', () => {
    const { result } = renderHook(() => useSortedTasks(tasks, 'priority'))
    expect(result.current.map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('urgency sort — ascending (1 = most urgent)', () => {
    const { result } = renderHook(() => useSortedTasks(tasks, 'urgency'))
    expect(result.current.map((t) => t.id)).toEqual(['a', 'c', 'b'])
  })

  it('time sort — ascending (undefined last)', () => {
    const { result } = renderHook(() => useSortedTasks(tasks, 'time'))
    expect(result.current.map((t) => t.id)).toEqual(['b', 'a', 'c'])
  })

  it('due sort — soonest first, no-date last', () => {
    // b has nextDueAt 2024-01-10, c has dueAt 2024-02-01, a has dueAt 2024-03-01
    const { result } = renderHook(() => useSortedTasks(tasks, 'due'))
    expect(result.current.map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('does not mutate the original array', () => {
    const original = [...tasks]
    renderHook(() => useSortedTasks(tasks, 'priority'))
    expect(tasks).toEqual(original)
  })
})
