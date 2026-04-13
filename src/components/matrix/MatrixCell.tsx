import type { Task } from '@/types/task'
import type { QuadrantMeta } from '@/utils/matrixUtils'
import { MatrixTaskChip } from './MatrixTaskChip'

interface Props {
  quadrant: QuadrantMeta
  tasks: Task[]
}

export function MatrixCell({ quadrant, tasks }: Props) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border-2 border-ink shadow-hard ${quadrant.bgClass}`}>
      <div className={`px-3 py-2 ${quadrant.headerClass}`}>
        <p className="font-display font-bold text-sm">{quadrant.label}</p>
        <p className="text-xs opacity-75 font-medium">{quadrant.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {tasks.length === 0 ? (
          <div
            className={`flex h-full min-h-[4rem] items-center justify-center rounded-xl border-2 border-dashed ${quadrant.emptyBorderClass}`}
          >
            <span className={`text-xs font-bold ${quadrant.emptyTextClass}`}>Nothing here</span>
          </div>
        ) : (
          tasks.map((task) => <MatrixTaskChip key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
