import type { Task } from '@/types/task'
import { TaskListItem } from './TaskListItem'

interface TaskListProps {
  tasks: Task[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCompleteStep: (taskId: string, stepId: string) => void
}

export function TaskList({ tasks, onEdit, onDelete, onCompleteStep }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No tasks here.</p>
        <p className="text-sm mt-1">Add a task or try a different sort.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskListItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onCompleteStep={(stepId) => onCompleteStep(task.id, stepId)}
          />
        </li>
      ))}
    </ul>
  )
}
