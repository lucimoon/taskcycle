import { create } from 'zustand'
import type { Goal, GoalDraft } from '@/types/goal'
import * as goalService from '@/services/db/goalService'
import { useTaskStore } from '@/store/taskStore'
import { syncIfConfigured } from '@/services/sync/fileSyncService'

interface GoalStore {
  goals: Goal[]
  loadGoals: () => Promise<void>
  addGoal: (draft: GoalDraft) => Promise<Goal>
  updateGoal: (id: string, changes: Partial<GoalDraft>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  assignTasks: (goalId: string, taskIds: string[]) => Promise<void>
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],

  loadGoals: async () => {
    const goals = await goalService.listGoals()
    set({ goals })
  },

  addGoal: async (draft) => {
    const goal = await goalService.createGoal(draft)
    set({ goals: [...get().goals, goal] })
    return goal
  },

  updateGoal: async (id, changes) => {
    const updated = await goalService.updateGoal(id, changes)
    set({ goals: get().goals.map((g) => (g.id === id ? updated : g)) })
  },

  deleteGoal: async (id) => {
    await goalService.deleteGoal(id)
    set({ goals: get().goals.filter((g) => g.id !== id) })
  },

  assignTasks: async (goalId, taskIds) => {
    await goalService.assignTasksToGoal(goalId, taskIds)
    await useTaskStore.getState().loadTasks()
    syncIfConfigured()
  },
}))
