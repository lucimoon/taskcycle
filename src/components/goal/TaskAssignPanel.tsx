import { useState, useMemo, useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useGoalStore } from '@/store/goalStore'
import { useCategoryStore } from '@/store/categoryStore'
import { isComplete } from '@/utils/taskUtils'

interface TaskAssignPanelProps {
  goalId: string
  onClose: () => void
}

export function TaskAssignPanel({ goalId, onClose }: TaskAssignPanelProps) {
  const tasks = useTaskStore((s) => s.tasks)
  const { goals, assignTasks } = useGoalStore()
  const { categories, loadCategories } = useCategoryStore()
  const goal = goals.find((g) => g.id === goalId)

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(tasks.filter((t) => t.goalIds?.includes(goalId)).map((t) => t.id)),
  )
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // Only show categories that appear on at least one task
  const activeCategories = useMemo(
    () => categories.filter((c) => tasks.some((t) => t.categoryIds?.includes(c.id))),
    [categories, tasks],
  )

  // Apply search + category filter together
  const visibleTasks = useMemo(() => {
    let result = tasks
    if (categoryFilter) {
      result = result.filter((t) => t.categoryIds?.includes(categoryFilter))
    }
    if (search) {
      const lower = search.toLowerCase()
      result = result.filter((t) => t.title.toLowerCase().includes(lower))
    }
    return result
  }, [tasks, search, categoryFilter])

  const isFiltered = search.length > 0 || categoryFilter !== null

  const activeTasks = useMemo(() => visibleTasks.filter((t) => !isComplete(t)), [visibleTasks])
  const completedTasks = useMemo(() => visibleTasks.filter((t) => isComplete(t)), [visibleTasks])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    await assignTasks(goalId, [...selected])
    onClose()
  }

  function TaskRow({ taskId, title, kind }: { taskId: string; title: string; kind: string }) {
    const checked = selected.has(taskId)
    return (
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => toggle(taskId)}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && toggle(taskId)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-ink/5 transition-colors min-h-[44px]"
      >
        <div
          className={[
            'w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
            checked ? 'bg-coral border-coral' : 'border-ink/30 bg-white/40',
          ].join(' ')}
        >
          {checked && <span className="text-white text-xs leading-none">✓</span>}
        </div>
        <span className="text-sm font-medium text-ink flex-1 leading-snug">{title}</span>
        <span className="text-xs text-ink/40 shrink-0">
          {kind === 'cyclic' ? 'Recurring' : 'Once'}
        </span>
      </div>
    )
  }

  return (
    <div className="card-glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        {goal && (
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: goal.color }} />
        )}
        <h2 className="font-display font-bold text-lg text-ink">
          {goal ? goal.name : 'Assign tasks'}
        </h2>
        <span className="text-sm text-ink/50 font-normal">— select tasks for this goal</span>
      </div>

      <input
        autoFocus
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks…"
        className="glass-input"
      />

      {activeCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter(null)}
            className={[
              'rounded-full px-3 py-1 text-xs font-semibold transition-all btn-action',
              categoryFilter === null
                ? 'bg-ink text-white shadow-sm'
                : 'bg-white/60 border border-white/80 text-ink hover:bg-ink/8',
            ].join(' ')}
          >
            All
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
              className={[
                'rounded-full px-3 py-1 text-xs font-semibold transition-all btn-action',
                categoryFilter === cat.id ? 'text-white shadow-sm' : 'text-ink',
              ].join(' ')}
              style={
                categoryFilter === cat.id
                  ? { backgroundColor: cat.color }
                  : { backgroundColor: `${cat.color}22`, border: `1px solid ${cat.color}55` }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-72 overflow-y-auto -mx-2 px-2 space-y-0.5">
        {isFiltered ? (
          visibleTasks.length === 0 ? (
            <p className="text-sm text-ink/40 text-center py-6">No tasks match</p>
          ) : (
            <>
              {activeTasks.map((t) => (
                <TaskRow key={t.id} taskId={t.id} title={t.title} kind={t.kind} />
              ))}
              {completedTasks.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-ink/30 uppercase tracking-widest pt-3 pb-1 px-3">
                    Completed
                  </p>
                  {completedTasks.map((t) => (
                    <div key={t.id} className="opacity-50">
                      <TaskRow taskId={t.id} title={t.title} kind={t.kind} />
                    </div>
                  ))}
                </>
              )}
            </>
          )
        ) : (
          <>
            {activeTasks.map((t) => (
              <TaskRow key={t.id} taskId={t.id} title={t.title} kind={t.kind} />
            ))}
            {completedTasks.length > 0 && (
              <>
                <p className="text-xs font-semibold text-ink/30 uppercase tracking-widest pt-3 pb-1 px-3">
                  Completed
                </p>
                {completedTasks.map((t) => (
                  <div key={t.id} className="opacity-50">
                    <TaskRow taskId={t.id} title={t.title} kind={t.kind} />
                  </div>
                ))}
              </>
            )}
            {tasks.length === 0 && (
              <p className="text-sm text-ink/40 text-center py-6">No tasks yet</p>
            )}
          </>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white btn-action shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : `Save (${selected.size} selected)`}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action disabled:opacity-40"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
