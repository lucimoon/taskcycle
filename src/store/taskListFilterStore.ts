import { create } from 'zustand'
import type { SortKey } from '@/hooks/useSortedTasks'

interface TaskListFilterStore {
  sort: SortKey
  categoryFilter: string | null
  goalFilter: string | null
  setSort: (sort: SortKey) => void
  setCategoryFilter: (filter: string | null) => void
  setGoalFilter: (filter: string | null) => void
}

export const useTaskListFilterStore = create<TaskListFilterStore>((set) => ({
  sort: 'priority',
  categoryFilter: null,
  goalFilter: null,
  setSort: (sort) => set({ sort }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setGoalFilter: (goalFilter) => set({ goalFilter }),
}))
