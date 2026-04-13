import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@/store/taskStore'
import { useSortedTasks, type SortKey } from '@/hooks/useSortedTasks'
import { SortControls } from '@/components/task/SortControls'
import { TaskList } from '@/components/task/TaskList'
import { ViewToggle } from '@/components/ViewToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Theme } from '@/hooks/useTheme'

interface Props {
  theme: Theme
  onThemeToggle: () => void
}

export function TaskListView({ theme, onThemeToggle }: Props) {
  const { tasks, loadTasks, removeTask, completeStep } = useTaskStore()
  const navigate = useNavigate()
  const [sort, setSort] = useState<SortKey>('default')
  const sorted = useSortedTasks(tasks, sort)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  function handleDelete(id: string) {
    if (window.confirm('Delete this task?')) {
      removeTask(id)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream border-b-2 border-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-xl text-ink tracking-tight">TaskCycle</span>
          <ViewToggle current="list" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            onClick={() => navigate('/tasks/new')}
            className="rounded-xl bg-coral border-2 border-ink px-4 py-2 text-sm font-bold text-white btn-lift"
          >
            + New Task
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {tasks.length > 0 && (
          <SortControls sort={sort} onChange={setSort} />
        )}
        <TaskList
          tasks={sorted}
          onEdit={(id) => navigate(`/tasks/${id}/edit`)}
          onDelete={handleDelete}
          onCompleteStep={(taskId, stepId) => completeStep(taskId, stepId)}
        />
      </main>
    </div>
  )
}
