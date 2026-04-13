import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  requestPermission,
  getPermissionState,
} from '@/services/notifications/notificationService'

export function SettingsView() {
  const navigate = useNavigate()
  const [permission, setPermission] = useState(getPermissionState)

  useEffect(() => {
    setPermission(getPermissionState())
  }, [])

  async function handleEnableNotifications() {
    const granted = await requestPermission()
    setPermission(granted ? 'granted' : 'denied')
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream border-b-2 border-ink px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-bold text-ink/60 hover:text-ink transition-colors"
        >
          ← Tasks
        </button>
        <span className="font-display font-bold text-xl text-ink">Settings</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="rounded-2xl border-2 border-ink bg-white shadow-hard p-6 space-y-5">
          <h2 className="font-display font-bold text-base text-ink">Notifications</h2>

          {permission === 'unsupported' ? (
            <p className="text-sm text-ink/60">
              Browser notifications aren't supported in this environment.
            </p>
          ) : (
            <>
              {/* Preview mockup */}
              <div className="rounded-xl border-2 border-ink bg-cream p-3 space-y-2">
                <p className="text-xs font-bold text-ink/50 uppercase tracking-widest">Preview</p>
                <div className="rounded-xl border-2 border-ink bg-white px-4 py-3 shadow-hard-sm flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg border-2 border-ink bg-sunny flex items-center justify-center text-base shrink-0">
                    ⏰
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">Due in 15 min</p>
                    <p className="text-sm text-ink/60">Your task title will appear here</p>
                  </div>
                </div>
                <p className="text-xs text-ink/50">
                  You'll get alerts like this 15 min before one-off tasks are due, and when recurring tasks become due.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-ink">Enable notifications</p>
                  <p className="text-xs text-ink/50 mt-0.5">
                    {permission === 'granted'
                      ? 'Notifications are on.'
                      : permission === 'denied'
                        ? 'Blocked in browser settings — update there to re-enable.'
                        : 'Let TaskCycle send you reminders.'}
                  </p>
                </div>

                {permission === 'default' && (
                  <button
                    onClick={handleEnableNotifications}
                    className="shrink-0 rounded-xl bg-coral border-2 border-ink px-4 py-2 text-sm font-bold text-white btn-lift"
                  >
                    Enable
                  </button>
                )}
                {permission === 'granted' && (
                  <span className="shrink-0 rounded-xl bg-mint border-2 border-ink px-3 py-1 text-xs font-bold text-ink">
                    ✓ On
                  </span>
                )}
                {permission === 'denied' && (
                  <span className="shrink-0 rounded-xl bg-coral/20 border-2 border-ink px-3 py-1 text-xs font-bold text-coral">
                    Blocked
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
