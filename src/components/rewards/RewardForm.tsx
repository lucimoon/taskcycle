import { useState } from 'react'
import type { Reward, RewardDraft, RewardLinkType } from '@/types/reward'
import type { Task } from '@/types/task'

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
        <label htmlFor="reward-label" className="block text-sm font-medium text-gray-700 mb-1">
          Reward name <span className="text-red-500">*</span>
        </label>
        <input
          id="reward-label"
          type="text"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Watch an episode"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="reward-desc" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          id="reward-desc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">Earn this reward when…</legend>
        <div className="flex gap-4">
          {(['tasks', 'count', 'both'] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="linkType"
                value={opt}
                checked={linkType === opt}
                onChange={() => setLinkType(opt)}
                className="accent-blue-600"
              />
              {opt === 'tasks' ? 'Linked tasks' : opt === 'count' ? 'Daily count' : 'Both'}
            </label>
          ))}
        </div>
      </fieldset>

      {showTasks && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Link to tasks</p>
          <input
            type="text"
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            placeholder="Filter tasks…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
              <p className="p-3 text-sm text-gray-400">No tasks found</p>
            ) : (
              filteredTasks.map((t) => (
                <label key={t.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={linkedTaskIds.includes(t.id)}
                    onChange={() => toggleTask(t.id)}
                    className="accent-blue-600"
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
          <label htmlFor="reward-threshold" className="block text-sm font-medium text-gray-700 mb-1">
            Daily task count
          </label>
          <input
            id="reward-threshold"
            type="number"
            min={1}
            value={threshold}
            onChange={(e) => setThreshold(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 5"
            className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Earn after completing this many tasks in a day</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!label.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          {initial ? 'Save changes' : 'Add reward'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
