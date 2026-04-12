import { getDueTasks, scheduleNextOccurrence } from '@/services/scheduler/recurrenceService'
import type { Task, CyclicTask } from '@/types/task'

function makeCyclic(overrides: Partial<CyclicTask> = {}): CyclicTask {
  return {
    id: 'c1', kind: 'cyclic', title: 'Laundry', steps: [],
    priority: 2, urgency: 2, createdAt: '2024-01-01T00:00:00Z',
    recurAfterMinutes: 60,
    ...overrides,
  }
}

const onceTask: Task = {
  id: 'o1', kind: 'once', title: 'Buy milk', steps: [],
  priority: 2, urgency: 1, createdAt: '2024-01-01T00:00:00Z',
}

describe('getDueTasks', () => {
  it('excludes once tasks', () => {
    expect(getDueTasks([onceTask])).toHaveLength(0)
  })

  it('includes cyclic tasks with no nextDueAt (never completed)', () => {
    const task = makeCyclic()
    expect(getDueTasks([task])).toEqual([task])
  })

  it('includes cyclic tasks where nextDueAt is in the past', () => {
    const task = makeCyclic({ nextDueAt: '2020-01-01T00:00:00Z' })
    expect(getDueTasks([task])).toEqual([task])
  })

  it('excludes cyclic tasks where nextDueAt is in the future', () => {
    const task = makeCyclic({ nextDueAt: '2099-01-01T00:00:00Z' })
    expect(getDueTasks([task])).toHaveLength(0)
  })
})

describe('scheduleNextOccurrence', () => {
  it('sets nextDueAt based on recurAfterMinutes', () => {
    const task = makeCyclic({ recurAfterMinutes: 120 })
    const before = Date.now()
    const scheduled = scheduleNextOccurrence(task)
    const after = Date.now()

    expect(scheduled.nextDueAt).toBeTruthy()
    const nextMs = new Date(scheduled.nextDueAt!).getTime()
    expect(nextMs).toBeGreaterThanOrEqual(before + 120 * 60_000)
    expect(nextMs).toBeLessThanOrEqual(after + 120 * 60_000)
  })

  it('sets lastCompletedAt and clears completedAt', () => {
    const task = makeCyclic({ completedAt: '2024-01-01T00:00:00Z' })
    const scheduled = scheduleNextOccurrence(task)
    expect(scheduled.lastCompletedAt).toBeTruthy()
    expect(scheduled.completedAt).toBeUndefined()
  })
})
