import { useState, useEffect } from 'react'
import { useConfirm } from '@/context/ConfirmContext'
import { useGoals } from '@/hooks/useGoals'
import { useTaskStore } from '@/store/taskStore'
import { TaskAssignPanel } from '@/components/goal/TaskAssignPanel'
import type { GoalDraft } from '@/types/goal'
import type { Priority } from '@/types/task'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#0f172a',
]

const PRIORITY_LABELS: Record<Priority, string> = {
  1: 'Critical', 2: 'High', 3: 'Normal', 4: 'Low',
}

const inputCls = 'glass-input'
const labelCls = 'text-sm font-bold text-ink'

interface GoalFormState {
  name: string
  color: string
  priority: Priority
}

function GoalForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: GoalFormState
  onSave: (draft: GoalDraft) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [color, setColor] = useState(initial?.color ?? PRESET_COLORS[0])
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 2)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color, priority })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className={labelCls}>
          Name <span className="text-coral">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Health, Career, Passion project"
          className={inputCls}
          autoFocus
        />
      </div>
      <div className="space-y-1.5">
        <span className={labelCls}>Color</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition-transform ${
                color === c ? 'scale-125 ring-2 ring-ink/40' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <span className={labelCls}>Priority</span>
        <p className="text-xs text-ink/50">Tasks in this goal sort by this priority.</p>
        <div className="flex gap-2 flex-wrap">
          {([1, 2, 3, 4] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              aria-pressed={priority === p}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-all btn-action',
                priority === p
                  ? 'bg-coral text-white shadow-md'
                  : 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-coral/10',
              ].join(' ')}
            >
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white btn-action shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

type Mode = 'list' | 'create' | { edit: string } | { assign: string }

export function GoalManagementView() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals()
  const { tasks, loadTasks } = useTaskStore()
  const { confirm } = useConfirm()
  const [mode, setMode] = useState<Mode>('list')

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function handleSave(draft: GoalDraft) {
    if (mode === 'create') {
      await addGoal(draft)
    } else if (typeof mode === 'object' && 'edit' in mode) {
      await updateGoal(mode.edit, draft)
    }
    setMode('list')
  }

  function handleDelete(id: string) {
    confirm('Delete this goal? Tasks assigned to it will lose this goal.', () => deleteGoal(id), { confirmLabel: 'Delete' })
  }

  const editingGoal =
    typeof mode === 'object' && 'edit' in mode
      ? goals.find((g) => g.id === mode.edit)
      : undefined

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-ink">Goals</h1>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="rounded-full bg-sunny text-ink px-5 py-2 text-sm font-semibold btn-action shadow-md"
          >
            + New Goal
          </button>
        )}
      </div>

      <main className="max-w-2xl mx-auto px-4 py-2 space-y-4">
        {(mode === 'create' || (typeof mode === 'object' && 'edit' in mode)) && (
          <div className="card-glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-ink mb-5">
              {mode === 'create' ? 'New goal' : 'Edit goal'}
            </h2>
            <GoalForm
              initial={
                editingGoal
                  ? { name: editingGoal.name, color: editingGoal.color, priority: editingGoal.priority }
                  : undefined
              }
              onSave={handleSave}
              onCancel={() => setMode('list')}
            />
          </div>
        )}

        {typeof mode === 'object' && 'assign' in mode && (
          <TaskAssignPanel goalId={mode.assign} onClose={() => setMode('list')} />
        )}

        {goals.length === 0 && mode === 'list' && (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <p className="text-ink/50">No goals yet — create one to give your tasks direction.</p>
          </div>
        )}

        {goals.map((goal) => {
          const taskCount = tasks.filter((t) => t.goalIds?.includes(goal.id)).length
          return (
            <div
              key={goal.id}
              className="card-glass rounded-2xl p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: goal.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink">{goal.name}</p>
                    {taskCount > 0 && (
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-lavender/20 text-lavender">
                        {taskCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/50">{PRIORITY_LABELS[goal.priority]} priority</p>
                </div>
              </div>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={() => setMode({ assign: goal.id })}
                  aria-label="Assign tasks to goal"
                  className="rounded-full p-1.5 text-ink/40 hover:bg-lavender/20 hover:text-lavender transition-colors text-sm btn-action"
                >
                  ☑️
                </button>
                <button
                  onClick={() => setMode({ edit: goal.id })}
                  aria-label="Edit goal"
                  className="rounded-full p-1.5 text-ink/40 hover:bg-ink/8 hover:text-ink transition-colors text-sm btn-action"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  aria-label="Delete goal"
                  className="rounded-full p-1.5 text-ink/40 hover:bg-coral/10 hover:text-coral transition-colors text-sm btn-action"
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
