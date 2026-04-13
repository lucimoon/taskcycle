import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@/store/taskStore'
import { EisenhowerMatrix } from '@/components/matrix/EisenhowerMatrix'
import { ViewToggle } from '@/components/ViewToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Theme } from '@/hooks/useTheme'

interface Props {
  theme: Theme
  onThemeToggle: () => void
}

export function MatrixView({ theme, onThemeToggle }: Props) {
  const { tasks, loadTasks } = useTaskStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return (
    <div className="mesh-bg flex flex-col min-h-screen">
      <header className="bg-white/50 backdrop-blur-lg border-b border-white/60 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-xl text-ink tracking-tight">TaskCycle</span>
          <ViewToggle current="matrix" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            onClick={() => navigate('/tasks/new')}
            className="rounded-full bg-coral text-white px-5 py-2.5 text-sm font-semibold btn-action shadow-md"
          >
            + New Task
          </button>
        </div>
      </header>

      <main className="flex-1 px-10 py-8 pl-14">
        <EisenhowerMatrix tasks={tasks} />
      </main>
    </div>
  )
}
