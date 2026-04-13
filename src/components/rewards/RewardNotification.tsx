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
      <div className="bg-gradient-to-r from-amber-400 to-yellow-300 px-6 py-5 shadow-xl">
        <div className="mx-auto max-w-2xl flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-900 uppercase tracking-wide">Reward earned</p>
            <p className="mt-0.5 text-2xl font-bold text-amber-950">{reward.label}</p>
            {reward.description && (
              <p className="mt-1 text-sm text-amber-800">{reward.description}</p>
            )}
          </div>
          <button
            onClick={() => dismissReward(reward.id)}
            aria-label="Dismiss reward"
            className="shrink-0 rounded-full p-1 text-amber-800 hover:bg-amber-300 transition-colors"
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
