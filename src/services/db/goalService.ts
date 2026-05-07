import { db } from './db'
import type { Goal, GoalDraft } from '@/types/goal'

export async function listGoals(): Promise<Goal[]> {
  return db.goals.toArray()
}

export async function getGoal(id: string): Promise<Goal | undefined> {
  return db.goals.get(id)
}

export async function createGoal(draft: GoalDraft): Promise<Goal> {
  const goal: Goal = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.goals.add(goal)
  return goal
}

export async function updateGoal(id: string, changes: Partial<GoalDraft>): Promise<Goal> {
  await db.goals.update(id, changes)
  const updated = await getGoal(id)
  if (!updated) throw new Error(`Goal ${id} not found after update`)
  return updated
}

export async function deleteGoal(id: string): Promise<void> {
  await db.goals.delete(id)
  await db.tasks.toCollection().modify((task: any) => {
    if (task.goalIds?.includes(id)) {
      task.goalIds = task.goalIds.filter((gid: string) => gid !== id)
    }
  })
}
