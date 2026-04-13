import { create } from 'zustand'
import type { Reward, RewardDraft } from '@/types/reward'
import * as rewardService from '@/services/db/rewardService'
import * as taskService from '@/services/db/taskService'

interface RewardStore {
  rewards: Reward[]
  pendingRewards: Reward[]
  loadRewards: () => Promise<void>
  addReward: (draft: RewardDraft) => Promise<void>
  updateReward: (id: string, changes: Partial<Reward>) => Promise<void>
  removeReward: (id: string) => Promise<void>
  checkRewards: (completedTaskId: string) => Promise<void>
  dismissReward: (id: string) => void
}

export const useRewardStore = create<RewardStore>((set, get) => ({
  rewards: [],
  pendingRewards: [],

  loadRewards: async () => {
    const rewards = await rewardService.listRewards()
    set({ rewards })
  },

  addReward: async (draft) => {
    await rewardService.createReward(draft)
    const rewards = await rewardService.listRewards()
    set({ rewards })
  },

  updateReward: async (id, changes) => {
    await rewardService.updateReward(id, changes)
    const rewards = await rewardService.listRewards()
    set({ rewards })
  },

  removeReward: async (id) => {
    await rewardService.deleteReward(id)
    const rewards = await rewardService.listRewards()
    set({ rewards })
  },

  checkRewards: async (completedTaskId) => {
    const { rewards } = get()
    if (rewards.length === 0) return

    // Count today's completions
    const allTasks = await taskService.listTasks()
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const dailyCount = allTasks.filter(
      (t) => t.completedAt && new Date(t.completedAt) >= todayStart,
    ).length

    const earned: Reward[] = []

    for (const reward of rewards) {
      const { linkType } = reward

      const taskMatch =
        (linkType === 'tasks' || linkType === 'both') &&
        reward.linkedTaskIds.includes(completedTaskId)

      const countMatch =
        (linkType === 'count' || linkType === 'both') &&
        reward.dailyCompletionThreshold != null &&
        dailyCount >= reward.dailyCompletionThreshold &&
        // Only trigger exactly at threshold, not every completion after
        dailyCount - 1 < reward.dailyCompletionThreshold

      if (taskMatch || countMatch) {
        earned.push(reward)
      }
    }

    if (earned.length > 0) {
      set((s) => ({ pendingRewards: [...s.pendingRewards, ...earned] }))
    }
  },

  dismissReward: (id) => {
    set((s) => ({ pendingRewards: s.pendingRewards.filter((r) => r.id !== id) }))
  },
}))
