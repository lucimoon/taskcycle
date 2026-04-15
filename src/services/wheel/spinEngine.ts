import type { Task } from '@/types/task'
import type { Wheel } from '@/types/wheel'

export function getEligibleTasks(wheel: Wheel, dueTasks: Task[]): Task[] {
  const inCategory = dueTasks.filter(
    (t) => !wheel.categoryIds.length || wheel.categoryIds.includes(t.categoryId ?? ''),
  )

  if (wheel.mode === 'free') return inCategory

  // sequential: exclude tasks already completed this round
  const completedIds = new Set(wheel.slots.filter((s) => s.completedAt).map((s) => s.taskId))
  return inCategory.filter((t) => !completedIds.has(t.id))
}

export function pickRandom(pool: Task[]): Task | null {
  if (!pool.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export function isWheelComplete(wheel: Wheel, dueTasks: Task[]): boolean {
  return getEligibleTasks(wheel, dueTasks).length === 0
}
