import { Routes, Route } from 'react-router-dom'
import { TaskListView } from '@/views/TaskListView'
import { TaskFormView } from '@/views/TaskFormView'
import { MatrixView } from '@/views/MatrixView'
import { RewardsView } from '@/views/RewardsView'
import { SettingsView } from '@/views/SettingsView'
import { RewardNotification } from '@/components/rewards/RewardNotification'
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler'
import { useTheme } from '@/hooks/useTheme'

function AppShell() {
  useNotificationScheduler()
  const { theme, setTheme } = useTheme()
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
      </Routes>
      <RewardNotification />
    </>
  )
}

export function App() {
  return <AppShell />
}
