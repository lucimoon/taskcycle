import type { Task } from '@/types/task'
import { getQuadrant, QUADRANTS } from '@/utils/matrixUtils'
import { MatrixCell } from './MatrixCell'

interface Props {
  tasks: Task[]
}

export function EisenhowerMatrix({ tasks }: Props) {
  const byQuadrant = Object.fromEntries(
    QUADRANTS.map((q) => [q.key, tasks.filter((t) => getQuadrant(t.priority, t.urgency) === q.key)]),
  )

  return (
    <div className="relative h-full">
      {/* Axis labels */}
      <div aria-hidden="true" className="absolute -top-6 left-0 right-0 flex justify-center">
        <span className="text-xs font-bold uppercase tracking-widest text-ink/30">Urgent →</span>
      </div>
      <div
        aria-hidden="true"
        className="absolute -left-8 top-0 bottom-0 flex items-center"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-ink/30">Important ↑</span>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
        {QUADRANTS.map((q) => (
          <MatrixCell key={q.key} quadrant={q} tasks={byQuadrant[q.key] ?? []} />
        ))}
      </div>
    </div>
  )
}
