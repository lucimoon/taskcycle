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
    <div className="rounded-2xl border-2 border-ink bg-sunny shadow-hard p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-ink">{reward.label}</p>
          {reward.description && (
            <p className="text-sm text-ink/60 mt-0.5 font-medium">{reward.description}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(reward.id)}
            aria-label="Edit reward"
            className="text-ink/40 hover:text-ink transition-colors text-sm"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(reward.id)}
            aria-label="Delete reward"
            className="text-ink/40 hover:text-coral transition-colors text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {(reward.linkType === 'tasks' || reward.linkType === 'both') &&
          linkedTasks.map((t) => (
            <span key={t.id} className="rounded-lg border-2 border-ink bg-surface px-2 py-0.5 font-bold text-ink">
              {t.title}
            </span>
          ))}
        {(reward.linkType === 'count' || reward.linkType === 'both') &&
          reward.dailyCompletionThreshold != null && (
            <span className="rounded-lg border-2 border-ink bg-surface px-2 py-0.5 font-bold text-ink">
              After {reward.dailyCompletionThreshold} tasks today
            </span>
          )}
      </div>
    </div>
  )
}
