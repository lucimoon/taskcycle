import { create } from 'zustand'
import type { Task } from '@/types/task'
import type { Wheel, WheelDraft } from '@/types/wheel'
import * as wheelService from '@/services/db/wheelService'
import { getEligibleTasks, pickRandom } from '@/services/wheel/spinEngine'
import { useTaskStore } from '@/store/taskStore'

interface WheelStore {
  wheels: Wheel[]
  loadWheels: () => Promise<void>
  createWheel: (draft: WheelDraft) => Promise<void>
  deleteWheel: (id: string) => Promise<void>
  restartWheel: (id: string) => Promise<void>
  spinWheel: (wheelId: string, dueTasks: Task[]) => Task | null
  completeWheelTask: (wheelId: string, taskId: string, dueTasks: Task[]) => Promise<void>
}

export const useWheelStore = create<WheelStore>((set, get) => ({
  wheels: [],

  loadWheels: async () => {
    const wheels = await wheelService.listWheels()
    set({ wheels })
  },

  createWheel: async (draft) => {
    await wheelService.createWheel(draft)
    const wheels = await wheelService.listWheels()
    set({ wheels })
  },

  deleteWheel: async (id) => {
    await wheelService.deleteWheel(id)
    const wheels = await wheelService.listWheels()
    set({ wheels })
  },

  restartWheel: async (id) => {
    await wheelService.restartWheel(id)
    const wheels = await wheelService.listWheels()
    set({ wheels })
  },

  spinWheel: (wheelId, dueTasks) => {
    const wheel = get().wheels.find((w) => w.id === wheelId)
    if (!wheel) return null
    const pool = getEligibleTasks(wheel, dueTasks)
    return pickRandom(pool)
  },

  completeWheelTask: async (wheelId, taskId, dueTasks) => {
    const wheel = get().wheels.find((w) => w.id === wheelId)
    if (!wheel) return

    const eligibleCount = getEligibleTasks(wheel, dueTasks).length

    await wheelService.completeSlot(wheelId, taskId, eligibleCount)
    await useTaskStore.getState().completeTask(taskId)

    const wheels = await wheelService.listWheels()
    set({ wheels })
  },
}))
