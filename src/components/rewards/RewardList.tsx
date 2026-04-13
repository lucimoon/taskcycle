import type { Reward } from '@/types/reward'
import type { Task } from '@/types/task'
import { RewardCard } from './RewardCard'

interface Props {
  rewards: Reward[]
  tasks: Task[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function RewardList({ rewards, tasks, onEdit, onDelete }: Props) {
  if (rewards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-2xl text-ink/20">No rewards yet!</p>
        <p className="text-sm text-ink/40 mt-1 font-medium">Add one to celebrate completing tasks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {rewards.map((r) => (
        <RewardCard key={r.id} reward={r} tasks={tasks} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
