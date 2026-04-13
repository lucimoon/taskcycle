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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Back to tasks"
          >
            ← Tasks
          </button>
          <h1 className="text-xl font-bold text-gray-900">Rewards</h1>
        </div>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
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
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
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
