import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '@/store/settingsStore'
import { requestPermission, getPermissionState } from '@/services/notifications/notificationService'
import { isSupported, requestDirectory, syncIfConfigured } from '@/services/sync/fileSyncService'

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="text-xs text-ink/50 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative shrink-0 w-11 h-6 rounded-full border-2 border-ink transition-colors',
          checked ? 'bg-mint' : 'bg-ink/10',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 w-4 h-4 rounded-full bg-ink transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-surface shadow-hard p-6 space-y-5">
      {children}
    </div>
  )
}

export function SettingsView() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettingsStore()
  const [permission, setPermission] = useState(getPermissionState)
  const [syncing, setSyncing] = useState(false)
  const syncSupported = isSupported()

  useEffect(() => {
    setPermission(getPermissionState())
  }, [])

  async function handleEnableNotifications() {
    const granted = await requestPermission()
    const next = granted ? 'granted' : 'denied'
    setPermission(next)
    if (granted) updateSettings({ notificationsEnabled: true })
  }

  async function handlePickFolder() {
    try {
      const handle = await requestDirectory()
      await updateSettings({ syncDirectoryHandle: handle })
    } catch {
      // user cancelled
    }
  }

  async function handleSyncNow() {
    setSyncing(true)
    await syncIfConfigured()
    setSyncing(false)
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

        {/* Engagement */}
        <SectionCard>
          <h2 className="font-display font-bold text-base text-ink">Feedback</h2>
          <ToggleRow
            label="Sound effects"
            description="Play a chime when you complete a step or task."
            checked={settings.audioEnabled}
            onChange={(v) => updateSettings({ audioEnabled: v })}
          />
          <div className="border-t border-ink/10" />
          <ToggleRow
            label="Animations"
            description="Flash completed steps and fire confetti on task completion."
            checked={settings.animationsEnabled}
            onChange={(v) => updateSettings({ animationsEnabled: v })}
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard>
          <h2 className="font-display font-bold text-base text-ink">Notifications</h2>

          {permission === 'unsupported' ? (
            <p className="text-sm text-ink/60">
              Browser notifications aren't supported in this environment.
            </p>
          ) : (
            <>
              <div className="rounded-xl border-2 border-ink bg-cream p-3 space-y-2">
                <p className="text-xs font-bold text-ink/50 uppercase tracking-widest">Preview</p>
                <div className="rounded-xl border-2 border-ink bg-surface px-4 py-3 shadow-hard-sm flex gap-3 items-start">
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
        </SectionCard>

        {/* File sync */}
        <SectionCard>
          <h2 className="font-display font-bold text-base text-ink">File sync</h2>
          <p className="text-sm text-ink/60">
            Point TaskCycle at a local folder and it will keep a <code className="font-mono text-xs bg-ink/8 px-1 py-0.5 rounded">taskcycle-data.json</code> snapshot there after every change.
          </p>

          {!syncSupported ? (
            <div className="rounded-xl border-2 border-ink/20 bg-ink/5 px-4 py-3">
              <p className="text-sm text-ink/50 font-medium">
                File sync requires the File System Access API, which is available in Chrome and Edge. It isn't supported in this browser.
              </p>
            </div>
          ) : settings.syncDirectoryHandle ? (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-ink bg-mint/15 px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-ink/50 uppercase tracking-widest mb-0.5">Syncing to</p>
                  <p className="text-sm font-bold text-ink">{settings.syncDirectoryHandle.name}</p>
                </div>
                <span className="text-lg">📁</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSyncNow}
                  disabled={syncing}
                  className="rounded-xl border-2 border-ink bg-sunny px-4 py-2 text-sm font-bold text-ink btn-lift"
                >
                  {syncing ? 'Syncing…' : 'Sync now'}
                </button>
                <button
                  onClick={() => updateSettings({ syncDirectoryHandle: undefined })}
                  className="rounded-xl border-2 border-ink bg-surface px-4 py-2 text-sm font-bold text-ink hover:bg-coral/10 hover:text-coral transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handlePickFolder}
              className="rounded-xl border-2 border-ink bg-lavender px-4 py-2 text-sm font-bold text-ink btn-lift"
            >
              Pick folder
            </button>
          )}
        </SectionCard>

      </main>
    </div>
  )
}
