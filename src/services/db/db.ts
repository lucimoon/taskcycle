import Dexie, { type EntityTable } from 'dexie'
import type { Task } from '@/types/task'
import type { Reward } from '@/types/reward'
import { SCHEMA } from './schema'

interface SettingsRow {
  key: string
  value: unknown
}

class TaskCycleDB extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  rewards!: EntityTable<Reward, 'id'>
  settings!: EntityTable<SettingsRow, 'key'>

  constructor() {
    super('taskcycle')
    this.version(1).stores(SCHEMA.v1)
  }
}

export const db = new TaskCycleDB()
