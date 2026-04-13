import type { Task, Priority, Urgency } from '@/types/task'
import { useCategoryStore } from '@/store/categoryStore'
import { CategoryBadge } from '@/components/category/CategoryBadge'

const PRIORITY_CHIP: Record<Priority, string> = {
  1: 'bg-coral text-white border-ink',
  2: 'bg-amber text-white border-ink',
  3: 'bg-sunny text-ink border-ink',
  4: 'bg-ink/10 text-ink border-ink',
}

const PRIORITY_LABEL: Record<Priority, string> = {
  1: 'P1',
  2: 'P2',
  3: 'P3',
  4: 'P4',
}

const URGENCY_CHIP: Record<Urgency, string> = {
  1: 'bg-coral text-white border-ink',
  2: 'bg-amber text-white border-ink',
  3: 'bg-sunny text-ink border-ink',
  4: 'bg-ink/10 text-ink border-ink',
}

const URGENCY_LABEL: Record<Urgency, string> = {
  1: 'U1',
  2: 'U2',
  3: 'U3',
  4: 'U4',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

interface TaskCardProps {
  task: Task
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleExpand?: () => void
  expanded?: boolean
}

export function TaskCard({ task, onEdit, onDelete, onToggleExpand, expanded }: TaskCardProps) {
  const completedSteps = task.steps.filter((s) => s.completedAt).length
  const isDone = Boolean(task.completedAt)
  const { categories } = useCategoryStore()
  const category = task.categoryId ? categories.find((c) => c.id === task.categoryId) : undefined

  return (
    <div className={`rounded-2xl border-2 border-ink p-4 shadow-hard space-y-3 transition-colors ${
      isDone ? 'bg-mint/20' : 'bg-surface'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-bold text-base ${isDone ? 'line-through text-ink/40' : 'text-ink'}`}>
            {task.title}
          </span>
          <span className={`rounded-lg border-2 px-2 py-0.5 text-xs font-bold ${
            task.kind === 'cyclic'
              ? 'bg-lavender text-ink border-ink'
              : 'bg-ink/8 text-ink border-ink'
          }`}>
            {task.kind === 'cyclic' ? '↻ Recurring' : 'Once'}
          </span>
          {isDone && (
            <span className="rounded-lg border-2 border-ink bg-mint px-2 py-0.5 text-xs font-bold text-ink">
              ✓ Done
            </span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task.id)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-ink/40 hover:bg-ink/8 hover:text-ink transition-colors text-sm"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="rounded-lg p-1.5 text-ink/40 hover:bg-coral/10 hover:text-coral transition-colors text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {category && <CategoryBadge category={category} />}
        <span className={`rounded-lg border-2 px-2 py-0.5 font-bold ${PRIORITY_CHIP[task.priority]}`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
        <span className={`rounded-lg border-2 px-2 py-0.5 font-bold ${URGENCY_CHIP[task.urgency]}`}>
          {URGENCY_LABEL[task.urgency]}
        </span>
        {task.estimatedMinutes && (
          <span className="rounded-lg border-2 border-ink bg-surface px-2 py-0.5 font-bold text-ink">
            ~{task.estimatedMinutes}m
          </span>
        )}
        {task.steps.length > 0 && (
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse steps' : 'Expand steps'}
            className="rounded-lg border-2 border-ink bg-surface px-2 py-0.5 font-bold text-ink hover:bg-sunny transition-colors"
          >
            {completedSteps}/{task.steps.length} steps {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>

      {task.kind === 'once' && task.dueAt && (
        <p className="text-xs font-medium text-ink/50">Due {formatDate(task.dueAt)}</p>
      )}
      {task.kind === 'cyclic' && task.nextDueAt && (
        <p className="text-xs font-medium text-ink/50">Next due {formatDate(task.nextDueAt)}</p>
      )}
    </div>
  )
}
