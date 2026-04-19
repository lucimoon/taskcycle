import type { TaskInstance } from '@/types/instance'
import { db } from './db'

export async function addInstance(instance: TaskInstance): Promise<void> {
  await db.instances.add(instance)
}

export async function listAllInstances(): Promise<TaskInstance[]> {
  return db.instances.toArray()
}
