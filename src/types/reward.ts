export interface Reward {
  id: string
  label: string
  description?: string
  linkedTaskIds: string[]
  dailyCompletionThreshold?: number
  createdAt: string
}

export type RewardDraft = Omit<Reward, 'id' | 'createdAt'>
