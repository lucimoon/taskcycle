import type { Task } from '@/types/task'
import type { QuadrantMeta } from '@/utils/matrixUtils'
import { MatrixTaskChip } from './MatrixTaskChip'

interface Props {
  quadrant: QuadrantMeta
  tasks: Task[]
}

export function MatrixCell({ quadrant, tasks }: Props) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-gray-200 ${quadrant.bgClass}`}>
      <div className={`px-3 py-2 ${quadrant.headerClass}`}>
        <p className="text-sm font-semibold">{quadrant.label}</p>
        <p className="text-xs opacity-80">{quadrant.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {tasks.length === 0 ? (
          <div
            className={`flex h-full min-h-[4rem] items-center justify-center rounded-md border-2 border-dashed ${quadrant.emptyBorderClass}`}
          >
            <span className={`text-xs ${quadrant.emptyTextClass}`}>Nothing here</span>
          </div>
        ) : (
          tasks.map((task) => <MatrixTaskChip key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
