import { useEffect, useRef } from 'react'
import { useTaskStore } from '@/store/taskStore'
import {
  scheduleNotification,
  cancelAll,
  getPermissionState,
} from '@/services/notifications/notificationService'
import type { Task } from '@/types/task'

const LEAD_MS = 15 * 60 * 1000

function memoKey(tasks: Task[]): string {
  return tasks
    .map((t) => {
      const due = t.kind === 'once' ? t.dueAt : t.nextDueAt
      return `${t.id}:${due ?? ''}`
    })
    .join(',')
}

export function useNotificationScheduler() {
  const tasks = useTaskStore((s) => s.tasks)
  const prevKey = useRef<string>('')

  useEffect(() => {
    if (getPermissionState() !== 'granted') return

    const key = memoKey(tasks)
    if (key === prevKey.current) return
    prevKey.current = key

    cancelAll()
    const now = Date.now()

    for (const task of tasks) {
      if (task.completedAt) continue

      if (task.kind === 'once' && task.dueAt) {
        const dueMs = new Date(task.dueAt).getTime()
        const fireAt = new Date(dueMs - LEAD_MS)
        if (fireAt.getTime() > now) {
          scheduleNotification(task.id, 'Due in 15 min', task.title, fireAt)
        }
      }

      if (task.kind === 'cyclic' && task.nextDueAt) {
        const dueMs = new Date(task.nextDueAt).getTime()
        if (dueMs <= now) {
          scheduleNotification(task.id, 'Due now', task.title, new Date())
        }
      }
    }
  }, [tasks])
}
