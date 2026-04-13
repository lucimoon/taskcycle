export type RewardLinkType = 'tasks' | 'count' | 'both'

export interface Reward {
  id: string
  label: string
  description?: string
  linkType: RewardLinkType
  linkedTaskIds: string[]
  dailyCompletionThreshold?: number
  createdAt: string
}

export type RewardDraft = Omit<Reward, 'id' | 'createdAt'>
