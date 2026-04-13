import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRewardStore } from '@/store/rewardStore'

const AUTO_DISMISS_MS = 6000

function NotificationPanel() {
  const { pendingRewards, dismissReward } = useRewardStore()
  const reward = pendingRewards[0]

  useEffect(() => {
    if (!reward) return
    const timer = setTimeout(() => dismissReward(reward.id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [reward, dismissReward])

  if (!reward) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
    >
      <div className="border-t-4 border-ink bg-sunny px-6 py-5 shadow-[0_-4px_0_var(--color-ink)]">
        <div className="mx-auto max-w-2xl flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-ink/50 uppercase tracking-widest mb-1">Reward earned 🎉</p>
            <p className="font-display font-bold text-2xl text-ink">{reward.label}</p>
            {reward.description && (
              <p className="mt-1 text-sm font-medium text-ink/70">{reward.description}</p>
            )}
          </div>
          <button
            onClick={() => dismissReward(reward.id)}
            aria-label="Dismiss reward"
            className="shrink-0 rounded-xl border-2 border-ink bg-surface w-8 h-8 flex items-center justify-center font-bold text-ink hover:bg-coral hover:text-white transition-colors shadow-hard-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export function RewardNotification() {
  let portal = document.getElementById('reward-portal')
  if (!portal) {
    portal = document.createElement('div')
    portal.id = 'reward-portal'
    document.body.appendChild(portal)
  }
  return createPortal(<NotificationPanel />, portal)
}
