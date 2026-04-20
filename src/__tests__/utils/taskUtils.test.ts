import { describe, it, expect } from 'vitest'
import { isComplete } from '@/utils/taskUtils'
import type { Task } from '@/types/task'

const FUTURE = new Date(Date.now() + 60 * 60_000).toISOString()
const PAST = new Date(Date.now() - 60 * 60_000).toISOString()

function makeOnce(overrides: Partial<Task> = {}): Task {
  return {
    id: 'once-1',
    kind: 'once',
    title: 'Test',
    steps: [],
    priority: 2,
    urgency: 2,
    createdAt: new Date().toISOString(),
    ...overrides,
  } as Task
}

function makeCyclic(overrides: Partial<Task> = {}): Task {
  return {
    id: 'cyclic-1',
    kind: 'cyclic',
    title: 'Test',
    steps: [],
    priority: 2,
    urgency: 2,
    recurAfterMinutes: 60,
    createdAt: new Date().toISOString(),
    ...overrides,
  } as Task
}

describe('isComplete — once tasks', () => {
  it('returns false when completedAt is not set', () => {
    expect(isComplete(makeOnce())).toBe(false)
  })

  it('returns true when completedAt is set', () => {
    expect(isComplete(makeOnce({ completedAt: new Date().toISOString() }))).toBe(true)
  })
})

describe('isComplete — cyclic tasks', () => {
  it('returns false when nextDueAt is not set', () => {
    expect(isComplete(makeCyclic())).toBe(false)
  })

  it('returns true when nextDueAt is in the future', () => {
    expect(isComplete(makeCyclic({ nextDueAt: FUTURE, lastCompletedAt: PAST }))).toBe(true)
  })

  it('returns false when nextDueAt is in the past (overdue — task is active again)', () => {
    expect(isComplete(makeCyclic({ nextDueAt: PAST, lastCompletedAt: PAST }))).toBe(false)
  })

  it('returns false when nextDueAt is in the past even if lastCompletedAt is set', () => {
    expect(isComplete(makeCyclic({ nextDueAt: PAST, lastCompletedAt: PAST }))).toBe(false)
  })
})
