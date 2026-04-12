import { db } from '@/services/db/db'
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
  completeTask,
} from '@/services/db/taskService'
import type { TaskDraft } from '@/types/task'

const onceDraft: TaskDraft = {
  kind: 'once',
  title: 'Buy milk',
  steps: [],
  priority: 2,
  urgency: 1,
}

const cyclicDraft: TaskDraft = {
  kind: 'cyclic',
  title: 'Do laundry',
  steps: [{ id: 'step-1', label: 'Start washer' }],
  priority: 3,
  urgency: 3,
  recurAfterMinutes: 60,
}

beforeEach(async () => {
  await db.tasks.clear()
})

describe('createTask', () => {
  it('persists a once task and returns it with id and createdAt', async () => {
    const task = await createTask(onceDraft)
    expect(task.id).toBeTruthy()
    expect(task.createdAt).toBeTruthy()
    expect(task.title).toBe('Buy milk')
    expect(task.kind).toBe('once')
  })

  it('appears in listTasks after creation', async () => {
    await createTask(onceDraft)
    const tasks = await listTasks()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Buy milk')
  })
})

describe('updateTask', () => {
  it('persists changes', async () => {
    const task = await createTask(onceDraft)
    const updated = await updateTask(task.id, { title: 'Buy oat milk' })
    expect(updated.title).toBe('Buy oat milk')
    const fetched = await getTask(task.id)
    expect(fetched?.title).toBe('Buy oat milk')
  })
})

describe('deleteTask', () => {
  it('removes task from the db', async () => {
    const task = await createTask(onceDraft)
    await deleteTask(task.id)
    const tasks = await listTasks()
    expect(tasks).toHaveLength(0)
  })
})

describe('completeTask — once', () => {
  it('sets completedAt', async () => {
    const task = await createTask(onceDraft)
    const before = Date.now()
    const completed = await completeTask(task.id)
    const after = Date.now()
    expect(completed.completedAt).toBeTruthy()
    const completedMs = new Date(completed.completedAt!).getTime()
    expect(completedMs).toBeGreaterThanOrEqual(before)
    expect(completedMs).toBeLessThanOrEqual(after)
  })
})

describe('completeTask — cyclic', () => {
  it('sets lastCompletedAt and schedules nextDueAt', async () => {
    const task = await createTask(cyclicDraft)
    const before = Date.now()
    const completed = await completeTask(task.id)
    const after = Date.now()

    expect(completed.kind).toBe('cyclic')
    if (completed.kind !== 'cyclic') return

    expect(completed.lastCompletedAt).toBeTruthy()
    expect(completed.nextDueAt).toBeTruthy()
    expect(completed.completedAt).toBeUndefined()

    const nextDueMs = new Date(completed.nextDueAt!).getTime()
    const expectedMin = before + 60 * 60_000
    const expectedMax = after + 60 * 60_000
    expect(nextDueMs).toBeGreaterThanOrEqual(expectedMin)
    expect(nextDueMs).toBeLessThanOrEqual(expectedMax)
  })

  it('resets step completedAt values', async () => {
    const draftWithCompletedStep: TaskDraft = {
      kind: 'cyclic',
      title: 'Laundry',
      steps: [{ id: 'step-1', label: 'Start washer', completedAt: new Date().toISOString() }],
      priority: 2,
      urgency: 2,
      recurAfterMinutes: 120,
    }
    const task = await createTask(draftWithCompletedStep)
    const completed = await completeTask(task.id)
    completed.steps.forEach((s) => {
      expect(s.completedAt).toBeUndefined()
    })
  })
})
