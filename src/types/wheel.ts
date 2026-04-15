export type WheelMode = 'free' | 'sequential'
export type WheelStatus = 'active' | 'completed'

export interface WheelSlot {
  taskId: string
  completedAt?: string
}

export interface Wheel {
  id: string
  name: string
  categoryIds: string[]
  mode: WheelMode
  status: WheelStatus
  slots: WheelSlot[]
  createdAt: string
  completedAt?: string
}

export type WheelDraft = Omit<Wheel, 'id' | 'createdAt' | 'slots' | 'status'>
