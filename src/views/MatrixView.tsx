import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@/store/taskStore'
import { EisenhowerMatrix } from '@/components/matrix/EisenhowerMatrix'
import { ViewToggle } from '@/components/ViewToggle'

export function MatrixView() {
  const { tasks, loadTasks } = useTaskStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <ViewToggle current="matrix" />
        <button
          onClick={() => navigate('/tasks/new')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Task
        </button>
      </header>

      <main className="flex-1 px-8 py-8 pl-12">
        <EisenhowerMatrix tasks={tasks} />
      </main>
    </div>
  )
}
