import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTaskStore } from '@/store/taskStore'
import { TaskForm } from '@/components/task/TaskForm'
import type { TaskDraft } from '@/types/task'

export function TaskFormView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, loadTasks, addTask, updateTask } = useTaskStore()

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const existing = id ? tasks.find((t) => t.id === id) : undefined

  async function handleSubmit(draft: TaskDraft) {
    if (id && existing) {
      await updateTask(id, draft as Parameters<typeof updateTask>[1])
    } else {
      await addTask(draft)
    }
    navigate('/')
  }

  if (id && tasks.length > 0 && !existing) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream border-b-2 border-ink px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-bold text-ink/60 hover:text-ink transition-colors"
          aria-label="Back to tasks"
        >
          ← Back
        </button>
        <span className="font-display font-bold text-xl text-ink">
          {id ? 'Edit task' : 'New task'}
        </span>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="rounded-2xl border-2 border-ink bg-surface shadow-hard p-6">
          <TaskForm
            initial={existing}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
          />
        </div>
      </main>
    </div>
  )
}
