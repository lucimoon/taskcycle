import { useSettingsStore } from '@/store/settingsStore'

export function useFocusStore() {
  const focusedTaskId = useSettingsStore((s) => s.settings.focusedTaskId ?? null)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  return {
    focusedTaskId,
    setFocus: (id: string) => updateSettings({ focusedTaskId: id }),
    clearFocus: () => updateSettings({ focusedTaskId: null }),
  }
}
