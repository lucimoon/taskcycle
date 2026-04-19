import Dexie, { type EntityTable } from 'dexie'
import type { Task } from '@/types/task'
import type { Reward } from '@/types/reward'
import type { Category } from '@/types/category'
import type { Wheel } from '@/types/wheel'
import type { TaskInstance } from '@/types/instance'
import { SCHEMA } from './schema'

interface SettingsRow {
  key: string
  value: unknown
}

class TaskCycleDB extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  rewards!: EntityTable<Reward, 'id'>
  settings!: EntityTable<SettingsRow, 'key'>
  categories!: EntityTable<Category, 'id'>
  wheels!: EntityTable<Wheel, 'id'>
  instances!: EntityTable<TaskInstance, 'id'>

  constructor() {
    super('taskcycle')
    this.version(1).stores(SCHEMA.v1)
    this.version(2).stores(SCHEMA.v2)
    this.version(3).stores(SCHEMA.v3)
    this.version(4).stores(SCHEMA.v4).upgrade((tx) =>
      tx.table('tasks').toCollection().modify((task: any) => {
        task.categoryIds = task.categoryId ? [task.categoryId] : []
        delete task.categoryId
      }),
    )
    this.version(5).stores(SCHEMA.v5)
  }
}

export const db = new TaskCycleDB()
