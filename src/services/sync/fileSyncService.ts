import type { Task } from '@/types/task'
import type { Reward } from '@/types/reward'
import { useSettingsStore } from '@/store/settingsStore'
import * as taskService from '@/services/db/taskService'
import * as rewardService from '@/services/db/rewardService'

const FILE_NAME = 'taskcycle-data.json'

export function isSupported(): boolean {
  return 'showDirectoryPicker' in window
}

export async function requestDirectory(): Promise<FileSystemDirectoryHandle> {
  // @ts-expect-error — showDirectoryPicker is not in all TS lib versions
  return window.showDirectoryPicker({ mode: 'readwrite' })
}

export async function exportSnapshot(
  handle: FileSystemDirectoryHandle,
  tasks: Task[],
  rewards: Reward[],
): Promise<void> {
  const file = await handle.getFileHandle(FILE_NAME, { create: true })
  const writable = await file.createWritable()
  await writable.write(JSON.stringify({ tasks, rewards, exportedAt: new Date().toISOString() }, null, 2))
  await writable.close()
}

export async function importSnapshot(
  handle: FileSystemDirectoryHandle,
): Promise<{ tasks: Task[]; rewards: Reward[] } | null> {
  try {
    const file = await handle.getFileHandle(FILE_NAME)
    const f = await file.getFile()
    const text = await f.text()
    const data = JSON.parse(text)
    if (!Array.isArray(data.tasks) || !Array.isArray(data.rewards)) return null
    return { tasks: data.tasks as Task[], rewards: data.rewards as Reward[] }
  } catch {
    return null
  }
}

export async function syncIfConfigured(): Promise<void> {
  const { syncDirectoryHandle } = useSettingsStore.getState().settings
  if (!syncDirectoryHandle) return
  try {
    const [tasks, rewards] = await Promise.all([
      taskService.listTasks(),
      rewardService.listRewards(),
    ])
    await exportSnapshot(syncDirectoryHandle, tasks, rewards)
  } catch {
    // Silently fail — sync is best-effort
  }
}
