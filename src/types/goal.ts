import type { Priority } from './task'

export interface Goal {
  id: string
  name: string
  color: string
  priority: Priority
  createdAt: string
}

export type GoalDraft = Omit<Goal, 'id' | 'createdAt'>
