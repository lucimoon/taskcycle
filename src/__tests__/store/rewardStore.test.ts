import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/services/db/db'
import { createReward } from '@/services/db/rewardService'
import { createTask, completeTask as completeTaskInDb } from '@/services/db/taskService'
import { useRewardStore } from '@/store/rewardStore'

beforeEach(async () => {
  await db.rewards.clear()
  await db.tasks.clear()
  useRewardStore.setState({ rewards: [], pendingRewards: [] })
})

describe('checkRewards — task-linked', () => {
  it('earns reward when the linked task is completed', async () => {
    const task = await createTask({ kind: 'once', title: 'Write tests', steps: [], priority: 1, urgency: 1 })
    const reward = await createReward({
      label: 'Coffee break',
      linkType: 'tasks',
      linkedTaskIds: [task.id],
    })
    await useRewardStore.getState().loadRewards()

    // Simulate completion: mark task completedAt so daily count includes it
    await completeTaskInDb(task.id)

    await useRewardStore.getState().checkRewards(task.id)

    expect(useRewardStore.getState().pendingRewards).toEqual([expect.objectContaining({ id: reward.id })])
  })

  it('does not earn reward for an unrelated task', async () => {
    const task = await createTask({ kind: 'once', title: 'A', steps: [], priority: 1, urgency: 1 })
    const other = await createTask({ kind: 'once', title: 'B', steps: [], priority: 1, urgency: 1 })
    await createReward({ label: 'Snack', linkType: 'tasks', linkedTaskIds: [other.id] })
    await useRewardStore.getState().loadRewards()

    await completeTaskInDb(task.id)
    await useRewardStore.getState().checkRewards(task.id)

    expect(useRewardStore.getState().pendingRewards).toHaveLength(0)
  })
})

describe('checkRewards — daily count threshold', () => {
  it('earns reward when the threshold is reached exactly', async () => {
    // Create 2 tasks and complete both; threshold is 2
    const t1 = await createTask({ kind: 'once', title: 'T1', steps: [], priority: 1, urgency: 1 })
    const t2 = await createTask({ kind: 'once', title: 'T2', steps: [], priority: 1, urgency: 1 })
    await createReward({ label: 'Break', linkType: 'count', linkedTaskIds: [], dailyCompletionThreshold: 2 })
    await useRewardStore.getState().loadRewards()

    await completeTaskInDb(t1.id)
    await useRewardStore.getState().checkRewards(t1.id)
    expect(useRewardStore.getState().pendingRewards).toHaveLength(0)

    await completeTaskInDb(t2.id)
    await useRewardStore.getState().checkRewards(t2.id)
    expect(useRewardStore.getState().pendingRewards).toHaveLength(1)
  })

  it('does not re-earn on subsequent completions past the threshold', async () => {
    const tasks = await Promise.all(
      ['A', 'B', 'C'].map((title) =>
        createTask({ kind: 'once', title, steps: [], priority: 1, urgency: 1 }),
      ),
    )
    await createReward({ label: 'Snack', linkType: 'count', linkedTaskIds: [], dailyCompletionThreshold: 2 })
    await useRewardStore.getState().loadRewards()

    for (const t of tasks) {
      await completeTaskInDb(t.id)
      await useRewardStore.getState().checkRewards(t.id)
    }

    // Should only have triggered once (at 2nd completion)
    expect(useRewardStore.getState().pendingRewards).toHaveLength(1)
  })
})

describe('dismissReward', () => {
  it('removes the reward from pendingRewards', async () => {
    const task = await createTask({ kind: 'once', title: 'X', steps: [], priority: 1, urgency: 1 })
    await createReward({ label: 'Prize', linkType: 'tasks', linkedTaskIds: [task.id] })
    await useRewardStore.getState().loadRewards()
    await completeTaskInDb(task.id)
    await useRewardStore.getState().checkRewards(task.id)

    const earned = useRewardStore.getState().pendingRewards[0]
    useRewardStore.getState().dismissReward(earned.id)

    expect(useRewardStore.getState().pendingRewards).toHaveLength(0)
  })
})
