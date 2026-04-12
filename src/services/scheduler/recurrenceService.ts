import type { Task, CyclicTask } from '@/types/task'

export function getDueTasks(tasks: Task[]): Task[] {
  const now = new Date().toISOString()
  return tasks.filter((task) => {
    if (task.kind !== 'cyclic') return false
    // never completed → always available
    if (!task.nextDueAt) return true
    // completed and interval has elapsed
    return task.nextDueAt <= now
  })
}

export function scheduleNextOccurrence(task: CyclicTask): CyclicTask {
  const now = new Date().toISOString()
  const nextDueAt = new Date(Date.now() + task.recurAfterMinutes * 60_000).toISOString()
  return { ...task, lastCompletedAt: now, nextDueAt, completedAt: undefined }
}
