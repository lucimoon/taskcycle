import { useState } from 'react'
import type { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { StepChecklist } from './StepChecklist'

interface TaskListItemProps {
  task: Task
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCompleteStep: (stepId: string) => void
}

export function TaskListItem({ task, onEdit, onDelete, onCompleteStep }: TaskListItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleExpand={task.steps.length > 0 ? () => setExpanded((e) => !e) : undefined}
        expanded={expanded}
      />
      {expanded && task.steps.length > 0 && (
        <div className="border-x-2 border-b-2 border-ink rounded-b-2xl bg-cream px-4 pb-4 -mt-2 pt-4">
          <StepChecklist task={task} onCompleteStep={onCompleteStep} />
        </div>
      )}
    </div>
  )
}
