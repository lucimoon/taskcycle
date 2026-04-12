import { Routes, Route } from 'react-router-dom'
import { HomeView } from '@/views/HomeView'
import { TaskFormView } from '@/views/TaskFormView'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/tasks/new" element={<TaskFormView />} />
      <Route path="/tasks/:id/edit" element={<TaskFormView />} />
    </Routes>
  )
}
