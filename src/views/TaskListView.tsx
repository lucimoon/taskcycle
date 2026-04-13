import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@/store/taskStore'
import { useCategoryStore } from '@/store/categoryStore'
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
  const { categories, loadCategories } = useCategoryStore()
  const navigate = useNavigate()
  const [sort, setSort] = useState<SortKey>('default')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [loadTasks, loadCategories])

  const filteredTasks = categoryFilter === null
    ? tasks
    : categoryFilter === '__none__'
      ? tasks.filter((t) => !t.categoryId)
      : tasks.filter((t) => t.categoryId === categoryFilter)
  const sorted = useSortedTasks(filteredTasks, sort)

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
          <button
            onClick={() => navigate('/categories')}
            className="rounded-xl border-2 border-ink bg-surface px-3 py-1.5 text-sm font-bold text-ink hover:bg-ink/8 transition-colors"
          >
            Categories
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="rounded-xl border-2 border-ink bg-surface px-3 py-1.5 text-sm font-bold text-ink hover:bg-ink/8 transition-colors"
          >
            Analytics
          </button>
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
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`rounded-xl border-2 border-ink px-3 py-1 text-xs font-bold transition-colors btn-lift ${
                categoryFilter === null ? 'bg-ink text-cream' : 'bg-surface text-ink hover:bg-ink/8'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
                className={`rounded-xl border-2 border-ink px-3 py-1 text-xs font-bold transition-colors btn-lift ${
                  categoryFilter === cat.id ? 'text-white' : 'bg-surface text-ink hover:bg-ink/8'
                }`}
                style={categoryFilter === cat.id ? { backgroundColor: cat.color } : undefined}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
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
