import { useState } from 'react'
import type { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { StepChecklist } from './StepChecklist'

interface TaskListItemProps {
  task: Task
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onComplete: () => void
  onUncomplete: () => void
  onCompleteStep: (stepId: string) => void
  onUncompleteStep: (stepId: string) => void
}

export function TaskListItem({ task, onEdit, onDelete, onComplete, onUncomplete, onCompleteStep, onUncompleteStep }: TaskListItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleExpand={task.steps.length > 0 ? () => setExpanded((e) => !e) : undefined}
        expanded={expanded}
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
      {expanded && task.steps.length > 0 && (
        <div className="card-glass rounded-b-2xl -mt-2 px-4 pb-4 pt-5 border-t-0">
          <StepChecklist task={task} onCompleteStep={onCompleteStep} onUncompleteStep={onUncompleteStep} />
        </div>
      )}
    </div>
  )
}
