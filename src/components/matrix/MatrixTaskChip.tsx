import { useNavigate } from 'react-router-dom'
import type { Task } from '@/types/task'

interface Props {
  task: Task
}

export function MatrixTaskChip({ task }: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/tasks/${task.id}/edit`)}
      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-left text-sm shadow-sm transition-shadow hover:shadow-md w-full"
    >
      <span className="truncate flex-1 text-gray-800">{task.title}</span>
      {task.estimatedMinutes != null && (
        <span className="shrink-0 rounded-full bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">
          {task.estimatedMinutes}m
        </span>
      )}
    </button>
  )
}
