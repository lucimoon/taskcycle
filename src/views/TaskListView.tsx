import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@/store/taskStore'
import { useSortedTasks, type SortKey } from '@/hooks/useSortedTasks'
import { SortControls } from '@/components/task/SortControls'
import { TaskList } from '@/components/task/TaskList'
import { ViewToggle } from '@/components/ViewToggle'

export function TaskListView() {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <ViewToggle current="list" />
        <button
          onClick={() => navigate('/tasks/new')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Task
        </button>
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
