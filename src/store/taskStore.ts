import { create } from 'zustand'
import type { Task, TaskDraft } from '@/types/task'
import * as taskService from '@/services/db/taskService'

interface TaskStore {
  tasks: Task[]
  loadTasks: () => Promise<void>
  addTask: (draft: TaskDraft) => Promise<void>
  updateTask: (id: string, changes: Partial<Task>) => Promise<void>
  removeTask: (id: string) => Promise<void>
  completeTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  loadTasks: async () => {
    const tasks = await taskService.listTasks()
    set({ tasks })
  },

  addTask: async (draft) => {
    await taskService.createTask(draft)
    const tasks = await taskService.listTasks()
    set({ tasks })
  },

  updateTask: async (id, changes) => {
    await taskService.updateTask(id, changes)
    const tasks = await taskService.listTasks()
    set({ tasks })
  },

  removeTask: async (id) => {
    await taskService.deleteTask(id)
    const tasks = await taskService.listTasks()
    set({ tasks })
  },

  completeTask: async (id) => {
    await taskService.completeTask(id)
    const tasks = await taskService.listTasks()
    set({ tasks })
  },
}))
