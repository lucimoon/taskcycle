import type { Task, Priority, Urgency } from '@/types/task'

const PRIORITY_CHIP: Record<Priority, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-gray-100 text-gray-600',
}

const PRIORITY_LABEL: Record<Priority, string> = {
  1: 'P1',
  2: 'P2',
  3: 'P3',
  4: 'P4',
}

const URGENCY_CHIP: Record<Urgency, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-gray-100 text-gray-600',
}

const URGENCY_LABEL: Record<Urgency, string> = {
  1: 'U1',
  2: 'U2',
  3: 'U3',
  4: 'U4',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

interface TaskCardProps {
  task: Task
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const completedSteps = task.steps.filter((s) => s.completedAt).length

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900">{task.title}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            task.kind === 'cyclic' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {task.kind === 'cyclic' ? 'Recurring' : 'Once'}
          </span>
          {task.completedAt && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Done
            </span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task.id)}
            aria-label="Edit task"
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-xs"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors text-xs"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium ${PRIORITY_CHIP[task.priority]}`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
        <span className={`rounded-full px-2 py-0.5 font-medium ${URGENCY_CHIP[task.urgency]}`}>
          {URGENCY_LABEL[task.urgency]}
        </span>
        {task.estimatedMinutes && (
          <span className="rounded-full bg-purple-100 px-2 py-0.5 font-medium text-purple-700">
            ~{task.estimatedMinutes}m
          </span>
        )}
        {task.steps.length > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
            {completedSteps}/{task.steps.length} steps
          </span>
        )}
      </div>

      {task.kind === 'once' && task.dueAt && (
        <p className="text-xs text-gray-500">Due {formatDate(task.dueAt)}</p>
      )}
      {task.kind === 'cyclic' && task.nextDueAt && (
        <p className="text-xs text-gray-500">Next due {formatDate(task.nextDueAt)}</p>
      )}
    </div>
  )
}
