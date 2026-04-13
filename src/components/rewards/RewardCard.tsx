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
    <div className="card-glass rounded-2xl p-4 space-y-2 bg-sunny/15">
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
            className="rounded-full p-1.5 text-ink/40 hover:bg-ink/8 hover:text-ink transition-colors text-sm btn-action"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(reward.id)}
            aria-label="Delete reward"
            className="rounded-full p-1.5 text-ink/40 hover:bg-coral/10 hover:text-coral transition-colors text-sm btn-action"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {(reward.linkType === 'tasks' || reward.linkType === 'both') &&
          linkedTasks.map((t) => (
            <span key={t.id} className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-0.5 font-semibold text-ink">
              {t.title}
            </span>
          ))}
        {(reward.linkType === 'count' || reward.linkType === 'both') &&
          reward.dailyCompletionThreshold != null && (
            <span className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-0.5 font-semibold text-ink">
              After {reward.dailyCompletionThreshold} tasks today
            </span>
          )}
      </div>
    </div>
  )
}
