import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { Task } from '@/types/task'
import { getQuadrant, QUADRANTS } from '@/utils/matrixUtils'
import { MatrixCell } from './MatrixCell'
import { useMatrixDrop } from '@/hooks/useMatrixDrop'

interface Props {
  tasks: Task[]
}

export function EisenhowerMatrix({ tasks }: Props) {
  const { handleDragEnd } = useMatrixDrop()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const byQuadrant = Object.fromEntries(
    QUADRANTS.map((q) => [q.key, tasks.filter((t) => getQuadrant(t.priority, t.urgency) === q.key)]),
  )

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative sm:h-full">
        {/* Axis labels — desktop only */}
        <div aria-hidden="true" className="hidden sm:flex absolute -top-6 left-0 right-0 justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-ink/30">Urgent →</span>
        </div>
        <div
          aria-hidden="true"
          className="hidden sm:flex absolute -left-8 top-0 bottom-0 items-center"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-ink/30">Important ↑</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-3 sm:h-full">
          {QUADRANTS.map((q) => (
            <MatrixCell key={q.key} quadrant={q} tasks={byQuadrant[q.key] ?? []} />
          ))}
        </div>
      </div>
    </DndContext>
  )
}
