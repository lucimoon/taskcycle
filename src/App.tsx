import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { TaskListView } from '@/views/TaskListView'
import { TaskFormView } from '@/views/TaskFormView'
import { MatrixView } from '@/views/MatrixView'
import { RewardsView } from '@/views/RewardsView'
import { SettingsView } from '@/views/SettingsView'
import { CategoryManagementView } from '@/views/CategoryManagementView'
import { CategoryAnalyticsView } from '@/views/CategoryAnalyticsView'
import { RewardNotification } from '@/components/rewards/RewardNotification'
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler'
import { useTheme } from '@/hooks/useTheme'
import { useSettingsStore } from '@/store/settingsStore'
import { useCategoryStore } from '@/store/categoryStore'
import { syncIfConfigured } from '@/services/sync/fileSyncService'

function AppShell() {
  useNotificationScheduler()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    useSettingsStore.getState().loadSettings().then(() => {
      syncIfConfigured()
    })
    useCategoryStore.getState().loadCategories()
  }, [])
  const toggleTheme = () => setTheme(theme === 'classic' ? 'dusk' : 'classic')
  return (
    <>
      <Routes>
        <Route path="/" element={<TaskListView theme={theme} onThemeToggle={toggleTheme} />} />
        <Route path="/matrix" element={<MatrixView theme={theme} onThemeToggle={toggleTheme} />} />
        <Route path="/tasks/new" element={<TaskFormView />} />
        <Route path="/tasks/:id/edit" element={<TaskFormView />} />
        <Route path="/rewards" element={<RewardsView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/categories" element={<CategoryManagementView />} />
        <Route path="/analytics" element={<CategoryAnalyticsView />} />
      </Routes>
      <RewardNotification />
    </>
  )
}

export function App() {
  return <AppShell />
}
