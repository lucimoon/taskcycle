export type TaskKind = 'once' | 'cyclic'
export type Priority = 1 | 2 | 3 | 4
export type Urgency = 1 | 2 | 3 | 4
export type CompletionRange = 'day' | 'week' | 'month' | 'whenever'

export interface Step {
  id: string
  label: string
  durationMinutes?: number
  completedAt?: string
}

interface BaseTask {
  id: string
  title: string
  steps: Step[]
  priority: Priority
  urgency: Urgency
  completionRange?: CompletionRange
  estimatedMinutes?: number
  notes?: string
  categoryIds?: string[]
  goalIds?: string[]
  createdAt: string
  completedAt?: string
}

export interface OnceTask extends BaseTask {
  kind: 'once'
  dueAt?: string
}

export interface CyclicTask extends BaseTask {
  kind: 'cyclic'
  recurAfterMinutes: number
  recurrenceType?: 'daily' | 'weekly' | 'monthly'
  recurrenceDay?: number
  lastCompletedAt?: string
  nextDueAt?: string
  completionDates?: string[]
}

export type Task = OnceTask | CyclicTask

// Distributive omit to preserve the discriminated union
export type TaskDraft =
  | Omit<OnceTask, 'id' | 'createdAt'>
  | Omit<CyclicTask, 'id' | 'createdAt'>
