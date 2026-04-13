import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRewardStore } from '@/store/rewardStore'
import { useTaskStore } from '@/store/taskStore'
import { RewardList } from '@/components/rewards/RewardList'
import { RewardForm } from '@/components/rewards/RewardForm'
import type { RewardDraft } from '@/types/reward'

type Mode = 'list' | 'create' | { edit: string }

export function RewardsView() {
  const { rewards, loadRewards, addReward, updateReward, removeReward } = useRewardStore()
  const { tasks, loadTasks } = useTaskStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('list')

  useEffect(() => {
    loadRewards()
    loadTasks()
  }, [loadRewards, loadTasks])

  async function handleSave(draft: RewardDraft) {
    if (mode === 'create') {
      await addReward(draft)
    } else if (typeof mode === 'object' && 'edit' in mode) {
      await updateReward(mode.edit, draft)
    }
    setMode('list')
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this reward?')) {
      removeReward(id)
    }
  }

  const editingReward =
    typeof mode === 'object' && 'edit' in mode
      ? rewards.find((r) => r.id === mode.edit)
      : undefined

  return (
    <div className="mesh-bg min-h-screen">
      <header className="bg-white/50 backdrop-blur-lg border-b border-white/60 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-ink/60 hover:text-ink transition-colors"
          >
            ← Tasks
          </button>
          <span className="font-display font-bold text-xl text-ink">Rewards</span>
        </div>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="rounded-full bg-sunny text-ink px-5 py-2.5 text-sm font-semibold btn-action shadow-md"
          >
            + New Reward
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {mode === 'list' ? (
          <RewardList
            rewards={rewards}
            tasks={tasks}
            onEdit={(id) => setMode({ edit: id })}
            onDelete={handleDelete}
          />
        ) : (
          <div className="card-glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-ink mb-5">
              {mode === 'create' ? 'New reward' : 'Edit reward'}
            </h2>
            <RewardForm
              initial={editingReward}
              tasks={tasks}
              onSave={handleSave}
              onCancel={() => setMode('list')}
            />
          </div>
        )}
      </main>
    </div>
  )
}
