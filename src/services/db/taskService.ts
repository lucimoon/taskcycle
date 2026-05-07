import type { Task, TaskDraft, CyclicTask } from '@/types/task'
import { db } from './db'

function computeNextDueAt(task: CyclicTask, from: Date = new Date()): string {
  if (task.recurrenceType === 'weekly' && task.recurrenceDay != null) {
    const d = new Date(from)
    d.setHours(0, 0, 0, 0)
    const daysUntil = ((task.recurrenceDay - d.getDay() + 7) % 7) || 7
    d.setDate(d.getDate() + daysUntil)
    return d.toISOString()
  }

  if (task.recurrenceType === 'monthly' && task.recurrenceDay != null) {
    const d = new Date(from)
    d.setHours(0, 0, 0, 0)
    if (task.recurrenceDay === 0) {
      // Last day of month: setMonth(m+2, 0) gives day-0 of month+2 = last day of month+1
      const lastDayThisMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      if (d.getDate() >= lastDayThisMonth) {
        d.setMonth(d.getMonth() + 2, 0)
      } else {
        d.setDate(lastDayThisMonth)
      }
    } else {
      if (d.getDate() >= task.recurrenceDay) {
        d.setMonth(d.getMonth() + 1)
      }
      d.setDate(task.recurrenceDay)
    }
    return d.toISOString()
  }

  // daily / undefined — interval-based; normalize to midnight for day-level recurrence
  const d = new Date(from.getTime() + task.recurAfterMinutes * 60_000)
  if (task.recurAfterMinutes >= 1440) {
    d.setHours(0, 0, 0, 0)
  }
  return d.toISOString()
}

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

  const nextDueAt = computeNextDueAt(task)
  const resetSteps = task.steps.map((s) => ({ ...s, completedAt: undefined }))
  const completionDates = [...(task.completionDates ?? []), now]

  return updateTask(id, {
    lastCompletedAt: now,
    nextDueAt,
    completedAt: undefined,
    steps: resetSteps,
    completionDates,
  })
}

export async function uncompleteTask(id: string): Promise<Task> {
  const task = await getTask(id)
  if (!task) throw new Error(`Task ${id} not found`)

  if (task.kind === 'once') {
    return updateTask(id, { completedAt: undefined })
  }

  const completionDates = (task.completionDates ?? []).slice(0, -1)
  const prevDate = completionDates[completionDates.length - 1]
  const nextDueAt = prevDate ? computeNextDueAt(task, new Date(prevDate)) : undefined
  return updateTask(id, {
    completionDates,
    lastCompletedAt: prevDate,
    nextDueAt,
  })
}
