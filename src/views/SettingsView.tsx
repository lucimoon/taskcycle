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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Back to tasks"
        >
          ← Tasks
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Notifications</h2>

          {permission === 'unsupported' && (
            <p className="text-sm text-gray-500">
              Browser notifications are not supported in this environment.
            </p>
          )}

          {permission !== 'unsupported' && (
            <>
              {/* Notification preview mockup */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview</p>
                <div className="rounded-lg bg-white border border-gray-200 px-4 py-3 shadow-sm flex gap-3 items-start">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-base shrink-0">⏰</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Due in 15 min</p>
                    <p className="text-sm text-gray-600">Your task title will appear here</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  You'll receive alerts like this 15 minutes before one-off tasks are due, and when recurring tasks become due.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable notifications</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {permission === 'granted'
                      ? 'Notifications are enabled.'
                      : permission === 'denied'
                        ? 'Permission was denied. Update this in your browser settings.'
                        : 'Allow TaskCycle to send you reminders.'}
                  </p>
                </div>

                {permission === 'default' && (
                  <button
                    onClick={handleEnableNotifications}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Enable
                  </button>
                )}
                {permission === 'granted' && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Enabled
                  </span>
                )}
                {permission === 'denied' && (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    Blocked
                  </span>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
