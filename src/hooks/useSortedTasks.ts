import { useMemo } from 'react'
import type { Task } from '@/types/task'

export type SortKey = 'priority' | 'urgency' | 'time' | 'due' | 'default'

function getDueString(task: Task): string {
  if (task.kind === 'once') return task.dueAt ?? ''
  return task.nextDueAt ?? ''
}

export function useSortedTasks(tasks: Task[], sort: SortKey): Task[] {
  return useMemo(() => {
    const sorted = [...tasks]
    switch (sort) {
      case 'priority':
        return sorted.sort((a, b) => a.priority - b.priority)
      case 'urgency':
        return sorted.sort((a, b) => a.urgency - b.urgency)
      case 'time':
        return sorted.sort((a, b) => {
          const aMin = a.estimatedMinutes ?? Infinity
          const bMin = b.estimatedMinutes ?? Infinity
          return aMin - bMin
        })
      case 'due':
        return sorted.sort((a, b) => {
          const aDate = getDueString(a)
          const bDate = getDueString(b)
          if (!aDate && !bDate) return 0
          if (!aDate) return 1
          if (!bDate) return -1
          return aDate.localeCompare(bDate)
        })
      default:
        return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    }
  }, [tasks, sort])
}
