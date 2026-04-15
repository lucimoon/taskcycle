import type { Task, TaskDraft } from '@/types/task'
import { db } from './db'

export async function listTasks(): Promise<Task[]> {
  return db.tasks.toArray()
}

export async function getTask(id: string): Promise<Task | undefined> {
  return db.tasks.get(id)
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  const task: Task = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  } as Task
  await db.tasks.add(task)
  return task
}

export async function updateTask(id: string, changes: Partial<Task>): Promise<Task> {
  await db.tasks.update(id, changes as Partial<Task>)
  const updated = await getTask(id)
  if (!updated) throw new Error(`Task ${id} not found after update`)
  return updated
}

export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id)
}

export async function completeTask(id: string): Promise<Task> {
  const task = await getTask(id)
  if (!task) throw new Error(`Task ${id} not found`)

  const now = new Date().toISOString()

  if (task.kind === 'once') {
    return updateTask(id, { completedAt: now })
  }

  const nextDueAt = new Date(Date.now() + task.recurAfterMinutes * 60_000).toISOString()
  const resetSteps = task.steps.map((s) => ({ ...s, completedAt: undefined }))

  return updateTask(id, {
    lastCompletedAt: now,
    nextDueAt,
    completedAt: undefined,
    steps: resetSteps,
  })
}

export async function uncompleteTask(id: string): Promise<Task> {
  const task = await getTask(id)
  if (!task) throw new Error(`Task ${id} not found`)

  if (task.kind === 'once') {
    return updateTask(id, { completedAt: undefined })
  }

  return updateTask(id, { lastCompletedAt: undefined, nextDueAt: undefined })
}
