import { create } from 'zustand'
import type { Task, TaskDraft } from '@/types/task'
import * as taskService from '@/services/db/taskService'
import { useRewardStore } from '@/store/rewardStore'
import { triggerTaskComplete, triggerStepComplete } from '@/services/audio/engagementService'
import { syncIfConfigured } from '@/services/sync/fileSyncService'

interface TaskStore {
  tasks: Task[]
  loadTasks: () => Promise<void>
  addTask: (draft: TaskDraft) => Promise<void>
  updateTask: (id: string, changes: Partial<Task>) => Promise<void>
  removeTask: (id: string) => Promise<void>
  completeTask: (id: string) => Promise<void>
  completeStep: (taskId: string, stepId: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  loadTasks: async () => {
    const tasks = await taskService.listTasks()
    set({ tasks })
  },

  addTask: async (draft) => {
    await taskService.createTask(draft)
    const tasks = await taskService.listTasks()
    set({ tasks })
    syncIfConfigured()
  },

  updateTask: async (id, changes) => {
    await taskService.updateTask(id, changes)
    const tasks = await taskService.listTasks()
    set({ tasks })
    syncIfConfigured()
  },

  removeTask: async (id) => {
    await taskService.deleteTask(id)
    const tasks = await taskService.listTasks()
    set({ tasks })
    syncIfConfigured()
  },

  completeTask: async (id) => {
    await taskService.completeTask(id)
    const tasks = await taskService.listTasks()
    set({ tasks })
    await useRewardStore.getState().checkRewards(id)
    triggerTaskComplete()
    syncIfConfigured()
  },

  completeStep: async (taskId, stepId) => {
    const task = get().tasks.find((t) => t.id === taskId)
    if (!task) return
    const now = new Date().toISOString()
    const updatedSteps = task.steps.map((s) =>
      s.id === stepId ? { ...s, completedAt: now } : s,
    )
    const allDone = updatedSteps.every((s) => s.completedAt)
    if (allDone && task.steps.length > 0) {
      // completing the last step completes the task (handles cyclic recurrence too)
      await taskService.updateTask(taskId, { steps: updatedSteps })
      await taskService.completeTask(taskId)
      await useRewardStore.getState().checkRewards(taskId)
      triggerTaskComplete()
    } else {
      await taskService.updateTask(taskId, { steps: updatedSteps })
      triggerStepComplete()
    }
    const tasks = await taskService.listTasks()
    set({ tasks })
    syncIfConfigured()
  },
}))
