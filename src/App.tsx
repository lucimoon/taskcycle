import { Routes, Route } from 'react-router-dom'
import { TaskListView } from '@/views/TaskListView'
import { TaskFormView } from '@/views/TaskFormView'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskListView />} />
      <Route path="/tasks/new" element={<TaskFormView />} />
      <Route path="/tasks/:id/edit" element={<TaskFormView />} />
    </Routes>
  )
}
