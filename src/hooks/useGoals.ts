import { useEffect, useCallback } from 'react'
import { useGoalStore } from '@/store/goalStore'
import type { Task, Priority } from '@/types/task'

export function useGoals() {
  const { goals, loadGoals, addGoal, updateGoal, deleteGoal } = useGoalStore()

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const getEffectivePriority = useCallback(
    (task: Task): Priority => {
      if (!task.goalIds?.length) return task.priority
      const matched = goals.filter((g) => task.goalIds!.includes(g.id))
      if (!matched.length) return task.priority
      return Math.min(...matched.map((g) => g.priority)) as Priority
    },
    [goals],
  )

  return { goals, addGoal, updateGoal, deleteGoal, getEffectivePriority }
}
