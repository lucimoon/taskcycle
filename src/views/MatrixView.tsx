import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { EisenhowerMatrix } from '@/components/matrix/EisenhowerMatrix'

export function MatrixView() {
  const { tasks, loadTasks } = useTaskStore()

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const now = new Date()
  const activeTasks = tasks.filter((t) => {
    if (t.completedAt) return false
    if (t.kind === 'cyclic' && t.lastCompletedAt && t.nextDueAt && new Date(t.nextDueAt) > now) return false
    return true
  })

  return (
    <div className="mesh-bg flex flex-col min-h-[calc(100vh-57px)]">
      <main className="flex-1 px-4 py-4 sm:px-10 sm:py-8 sm:pl-14">
        <EisenhowerMatrix tasks={activeTasks} />
      </main>
    </div>
  )
}
