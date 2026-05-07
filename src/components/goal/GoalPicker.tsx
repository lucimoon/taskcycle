import { useState } from 'react'
import { useGoals } from '@/hooks/useGoals'
import type { Priority } from '@/types/task'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
]

const PRIORITY_LABELS: Record<Priority, string> = {
  1: 'Critical', 2: 'High', 3: 'Normal', 4: 'Low',
}

interface GoalPickerProps {
  value: string[]
  onChange: (goalIds: string[]) => void
}

export function GoalPicker({ value, onChange }: GoalPickerProps) {
  const { goals, addGoal } = useGoals()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [newPriority, setNewPriority] = useState<Priority>(2)

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    const goal = await addGoal({ name: newName.trim(), color: newColor, priority: newPriority })
    onChange([...value, goal.id])
    setNewName('')
    setNewColor(PRESET_COLORS[0])
    setNewPriority(2)
    setCreating(false)
  }

  const selectedGoals = goals.filter((g) => value.includes(g.id))
  const unselectedGoals = goals.filter((g) => !value.includes(g.id))

  return (
    <div className="space-y-2">
      {selectedGoals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedGoals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggle(goal.id)}
              className="rounded-full px-3 py-1 text-xs font-semibold text-white flex items-center gap-1 transition-opacity hover:opacity-80"
              style={{ backgroundColor: goal.color }}
            >
              {goal.name} <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      {unselectedGoals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unselectedGoals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggle(goal.id)}
              className="rounded-full px-3 py-1 text-xs font-semibold border bg-white/60 border-white/80 text-ink hover:bg-white/80 transition-colors"
            >
              {goal.name}
            </button>
          ))}
        </div>
      )}

      {creating ? (
        <form onSubmit={handleCreate} className="space-y-2 pt-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Goal name"
            className="glass-input"
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  newColor === c ? 'scale-125 ring-2 ring-ink/40' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {([1, 2, 3, 4] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNewPriority(p)}
                aria-pressed={newPriority === p}
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold transition-all btn-action',
                  newPriority === p
                    ? 'bg-coral text-white shadow-sm'
                    : 'bg-white/60 border border-white/80 text-ink hover:bg-coral/10',
                ].join(' ')}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!newName.trim()}
              className="rounded-full bg-coral text-white px-4 py-1.5 text-xs font-semibold btn-action disabled:opacity-40"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setCreating(false); setNewName('') }}
              className="rounded-full bg-white/60 border border-white/80 text-ink px-4 py-1.5 text-xs font-semibold btn-action"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="text-xs text-ink/50 hover:text-ink underline transition-colors"
        >
          + New goal
        </button>
      )}
    </div>
  )
}
