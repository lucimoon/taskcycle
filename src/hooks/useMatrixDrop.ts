import type { DragEndEvent } from '@dnd-kit/core'
import { useTaskStore } from '@/store/taskStore'
import { getQuadrant, quadrantToPriorityUrgency, type QuadrantKey } from '@/utils/matrixUtils'

export function useMatrixDrop() {
  const { tasks, updateTask } = useTaskStore()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const targetQuadrant = over.id as QuadrantKey
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const currentQuadrant = getQuadrant(task.priority, task.urgency)
    if (currentQuadrant === targetQuadrant) return

    const { priority, urgency } = quadrantToPriorityUrgency(targetQuadrant)
    updateTask(taskId, { priority, urgency })
  }

  return { handleDragEnd }
}
