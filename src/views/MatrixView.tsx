import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { EisenhowerMatrix } from '@/components/matrix/EisenhowerMatrix'

export function MatrixView() {
  const { tasks, loadTasks } = useTaskStore()

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return (
    <div className="mesh-bg flex flex-col min-h-[calc(100vh-57px)]">
      <main className="flex-1 px-4 py-4 sm:px-10 sm:py-8 sm:pl-14">
        <EisenhowerMatrix tasks={tasks} />
      </main>
    </div>
  )
}
