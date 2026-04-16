import type { Wheel, WheelDraft } from '@/types/wheel'
import { db } from './db'

export async function listWheels(): Promise<Wheel[]> {
  return db.wheels.orderBy('createdAt').toArray()
}

export async function getWheel(id: string): Promise<Wheel | undefined> {
  return db.wheels.get(id)
}

export async function createWheel(draft: WheelDraft): Promise<Wheel> {
  const wheel: Wheel = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'active',
    slots: [],
  }
  await db.wheels.add(wheel)
  return wheel
}

export async function updateWheel(id: string, changes: Partial<Wheel>): Promise<void> {
  await db.wheels.update(id, changes)
}

export async function deleteWheel(id: string): Promise<void> {
  await db.wheels.delete(id)
}

export async function completeSlot(wheelId: string, taskId: string, eligibleCount: number): Promise<void> {
  const wheel = await getWheel(wheelId)
  if (!wheel) throw new Error(`Wheel ${wheelId} not found`)

  const now = new Date().toISOString()
  const existingSlot = wheel.slots.find((s) => s.taskId === taskId)
  const updatedSlots = existingSlot
    ? wheel.slots.map((s) => (s.taskId === taskId ? { ...s, completedAt: now } : s))
    : [...wheel.slots, { taskId, completedAt: now }]

  const completedCount = updatedSlots.filter((s) => s.completedAt).length
  const isComplete = completedCount >= eligibleCount

  await db.wheels.update(wheelId, {
    slots: updatedSlots,
    ...(isComplete ? { status: 'completed', completedAt: now } : {}),
  })
}

export async function restartWheel(id: string): Promise<void> {
  await db.wheels.update(id, {
    slots: [],
    status: 'active',
    completedAt: undefined,
  })
}
