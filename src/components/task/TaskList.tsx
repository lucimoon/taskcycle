import type { Task } from '@/types/task'
import { TaskListItem } from './TaskListItem'

interface TaskListProps {
  tasks: Task[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onComplete: (taskId: string) => void
  onUncomplete: (taskId: string) => void
  onCompleteStep: (taskId: string, stepId: string) => void
  onUncompleteStep: (taskId: string, stepId: string) => void
}

export function TaskList({ tasks, onEdit, onDelete, onComplete, onUncomplete, onCompleteStep, onUncompleteStep }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-2xl text-ink/20">Nothing here!</p>
        <p className="text-sm text-ink/40 mt-1 font-medium">Add a task to get started.</p>
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
            onComplete={() => onComplete(task.id)}
            onUncomplete={() => onUncomplete(task.id)}
            onCompleteStep={(stepId) => onCompleteStep(task.id, stepId)}
            onUncompleteStep={(stepId) => onUncompleteStep(task.id, stepId)}
          />
        </li>
      ))}
    </ul>
  )
}
