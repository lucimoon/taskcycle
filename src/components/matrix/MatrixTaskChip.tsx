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
      className="flex items-center gap-1.5 rounded-xl border-2 border-ink bg-white px-3 py-1.5 text-left text-sm font-medium shadow-hard-sm transition-shadow hover:shadow-hard w-full"
    >
      <span className="truncate flex-1 text-ink">{task.title}</span>
      {task.estimatedMinutes != null && (
        <span className="shrink-0 rounded-lg border-2 border-ink bg-white px-1.5 py-0.5 text-xs font-bold text-ink">
          {task.estimatedMinutes}m
        </span>
      )}
    </button>
  )
}
