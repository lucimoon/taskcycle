import { useState } from 'react'
import type { Reward, RewardDraft, RewardLinkType } from '@/types/reward'
import type { Task } from '@/types/task'

const inputCls = 'rounded-xl border-2 border-ink px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coral/40 font-body w-full'
const labelCls = 'block text-sm font-bold text-ink mb-1'

interface Props {
  initial?: Reward
  tasks: Task[]
  onSave: (draft: RewardDraft) => void
  onCancel: () => void
}

export function RewardForm({ initial, tasks, onSave, onCancel }: Props) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [linkType, setLinkType] = useState<RewardLinkType>(initial?.linkType ?? 'tasks')
  const [linkedTaskIds, setLinkedTaskIds] = useState<string[]>(initial?.linkedTaskIds ?? [])
  const [taskFilter, setTaskFilter] = useState('')
  const [threshold, setThreshold] = useState<number | ''>(initial?.dailyCompletionThreshold ?? '')

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(taskFilter.toLowerCase()),
  )

  function toggleTask(id: string) {
    setLinkedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      label: label.trim(),
      description: description.trim() || undefined,
      linkType,
      linkedTaskIds: linkType === 'count' ? [] : linkedTaskIds,
      dailyCompletionThreshold:
        linkType === 'tasks' ? undefined : threshold === '' ? undefined : threshold,
    })
  }

  const showTasks = linkType === 'tasks' || linkType === 'both'
  const showCount = linkType === 'count' || linkType === 'both'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="reward-label" className={labelCls}>
          Reward name <span className="text-coral">*</span>
        </label>
        <input
          id="reward-label"
          type="text"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Watch an episode"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="reward-desc" className={labelCls}>Description</label>
        <input
          id="reward-desc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          className={inputCls}
        />
      </div>

      <fieldset>
        <legend className={labelCls}>Earn this reward when…</legend>
        <div className="inline-flex rounded-xl border-2 border-ink overflow-hidden shadow-hard-sm mt-1">
          {(['tasks', 'count', 'both'] as const).map((opt, i) => (
            <label
              key={opt}
              className={`cursor-pointer px-3 py-1.5 text-xs font-bold transition-colors ${
                i > 0 ? 'border-l-2 border-ink' : ''
              } ${linkType === opt ? 'bg-lavender text-ink' : 'bg-cream text-ink hover:bg-lavender/20'}`}
            >
              <input
                type="radio"
                name="linkType"
                value={opt}
                checked={linkType === opt}
                onChange={() => setLinkType(opt)}
                className="sr-only"
              />
              {opt === 'tasks' ? 'Linked tasks' : opt === 'count' ? 'Daily count' : 'Both'}
            </label>
          ))}
        </div>
      </fieldset>

      {showTasks && (
        <div>
          <p className={labelCls}>Link to tasks</p>
          <input
            type="text"
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            placeholder="Filter tasks…"
            className={`${inputCls} mb-2`}
          />
          <div className="max-h-40 overflow-y-auto rounded-xl border-2 border-ink divide-y-2 divide-ink/10">
            {filteredTasks.length === 0 ? (
              <p className="p-3 text-sm font-medium text-ink/40">No tasks found</p>
            ) : (
              filteredTasks.map((t) => (
                <label key={t.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-sunny/20 font-medium">
                  <input
                    type="checkbox"
                    checked={linkedTaskIds.includes(t.id)}
                    onChange={() => toggleTask(t.id)}
                    className="accent-coral h-4 w-4"
                  />
                  <span className="truncate">{t.title}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {showCount && (
        <div>
          <label htmlFor="reward-threshold" className={labelCls}>Daily task count</label>
          <input
            id="reward-threshold"
            type="number"
            min={1}
            value={threshold}
            onChange={(e) => setThreshold(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 5"
            className="w-32 rounded-xl border-2 border-ink px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coral/40 font-body"
          />
          <p className="mt-1 text-xs font-medium text-ink/50">Earn after completing this many tasks in a day</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!label.trim()}
          className="rounded-xl bg-coral border-2 border-ink px-4 py-2 text-sm font-bold text-white btn-lift disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {initial ? 'Save changes' : 'Add reward'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border-2 border-ink bg-cream px-4 py-2 text-sm font-bold text-ink hover:bg-ink/8 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
