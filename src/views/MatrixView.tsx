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
    <div className="flex flex-col min-h-screen bg-cream">
      <header className="bg-cream border-b-2 border-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-xl text-ink tracking-tight">TaskCycle</span>
          <ViewToggle current="matrix" />
        </div>
        <button
          onClick={() => navigate('/tasks/new')}
          className="rounded-xl bg-coral border-2 border-ink px-4 py-2 text-sm font-bold text-white btn-lift"
        >
          + New Task
        </button>
      </header>

      <main className="flex-1 px-10 py-8 pl-14">
        <EisenhowerMatrix tasks={tasks} />
      </main>
    </div>
  )
}
