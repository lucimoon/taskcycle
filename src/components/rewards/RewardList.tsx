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
      <p className="text-sm text-gray-500 text-center py-8">
        No rewards yet. Add one to celebrate completing tasks!
      </p>
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
