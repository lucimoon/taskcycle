import type { Reward, RewardDraft } from '@/types/reward'
import { db } from './db'

export async function listRewards(): Promise<Reward[]> {
  return db.rewards.toArray()
}

export async function getReward(id: string): Promise<Reward | undefined> {
  return db.rewards.get(id)
}

export async function createReward(draft: RewardDraft): Promise<Reward> {
  const reward: Reward = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.rewards.add(reward)
  return reward
}

export async function updateReward(id: string, changes: Partial<Reward>): Promise<Reward> {
  await db.rewards.update(id, changes)
  const updated = await getReward(id)
  if (!updated) throw new Error(`Reward ${id} not found after update`)
  return updated
}

export async function deleteReward(id: string): Promise<void> {
  await db.rewards.delete(id)
}
