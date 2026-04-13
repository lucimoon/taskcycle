import type { Reward } from '@/types/reward'
import type { Task } from '@/types/task'

interface Props {
  reward: Reward
  tasks: Task[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function RewardCard({ reward, tasks, onEdit, onDelete }: Props) {
  const linkedTasks = tasks.filter((t) => reward.linkedTaskIds.includes(t.id))

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{reward.label}</p>
          {reward.description && (
            <p className="text-sm text-gray-600 mt-0.5">{reward.description}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(reward.id)}
            aria-label="Edit reward"
            className="text-gray-400 hover:text-gray-700 transition-colors text-sm"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(reward.id)}
            aria-label="Delete reward"
            className="text-gray-400 hover:text-red-600 transition-colors text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {(reward.linkType === 'tasks' || reward.linkType === 'both') &&
          linkedTasks.map((t) => (
            <span key={t.id} className="rounded-full bg-amber-200 px-2 py-0.5 text-amber-900">
              {t.title}
            </span>
          ))}
        {(reward.linkType === 'count' || reward.linkType === 'both') &&
          reward.dailyCompletionThreshold != null && (
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-amber-900">
              After {reward.dailyCompletionThreshold} tasks today
            </span>
          )}
      </div>
    </div>
  )
}
