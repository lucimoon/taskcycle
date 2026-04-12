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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">
          {id ? 'Edit task' : 'New task'}
        </h1>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
