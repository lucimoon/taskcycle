import { useEffect, useState } from 'react'
import type { Task } from '@/types/task'
import { getDueTasks } from '@/services/scheduler/recurrenceService'

const POLL_INTERVAL_MS = 60_000

export function useDueTasks(tasks: Task[]): Task[] {
  const [due, setDue] = useState<Task[]>(() => getDueTasks(tasks))

  useEffect(() => {
    setDue(getDueTasks(tasks))
    const id = setInterval(() => setDue(getDueTasks(tasks)), POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [tasks])

  return due
}
