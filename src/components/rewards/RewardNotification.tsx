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
      className="fixed bottom-6 left-1/2 z-50 animate-notification-bounce"
    >
      <div className="card-glass rounded-2xl shadow-xl px-6 py-5 min-w-[320px] max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-ink/50 uppercase tracking-widest mb-1">Reward earned 🎉</p>
            <p className="font-display font-bold text-2xl text-ink">{reward.label}</p>
            {reward.description && (
              <p className="mt-1 text-sm font-medium text-ink/70">{reward.description}</p>
            )}
          </div>
          <button
            onClick={() => dismissReward(reward.id)}
            aria-label="Dismiss reward"
            className="shrink-0 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 w-8 h-8 flex items-center justify-center font-bold text-ink hover:bg-coral/20 hover:text-coral transition-colors btn-action"
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
