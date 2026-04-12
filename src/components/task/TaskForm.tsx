import { useState } from 'react'
import type { Task, TaskDraft, TaskKind, Priority, Urgency, Step } from '@/types/task'
import { KindToggle } from './KindToggle'
import { StepList } from './StepList'
import { PriorityUrgencyPicker } from './PriorityUrgencyPicker'

type RecurUnit = 'minutes' | 'hours' | 'days'

const RECUR_MULTIPLIERS: Record<RecurUnit, number> = {
  minutes: 1,
  hours: 60,
  days: 1440,
}

function toRecurMinutes(amount: number, unit: RecurUnit): number {
  return amount * RECUR_MULTIPLIERS[unit]
}

interface TaskFormProps {
  initial?: Task
  onSubmit: (draft: TaskDraft) => void
  onCancel: () => void
}

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [kind, setKind] = useState<TaskKind>(initial?.kind ?? 'once')
  const [dueAt, setDueAt] = useState(
    initial?.kind === 'once' && initial.dueAt ? initial.dueAt.slice(0, 16) : '',
  )
  const [recurAmount, setRecurAmount] = useState(
    initial?.kind === 'cyclic' ? Math.round(initial.recurAfterMinutes / 60) || 1 : 1,
  )
  const [recurUnit, setRecurUnit] = useState<RecurUnit>(
    initial?.kind === 'cyclic' && initial.recurAfterMinutes < 60 ? 'minutes' : 'hours',
  )
  const [steps, setSteps] = useState<Step[]>(initial?.steps ?? [])
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 2)
  const [urgency, setUrgency] = useState<Urgency>(initial?.urgency ?? 2)
  const [estimatedMinutes, setEstimatedMinutes] = useState(initial?.estimatedMinutes ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const base = {
      title: title.trim(),
      steps,
      priority,
      urgency,
      estimatedMinutes: estimatedMinutes !== '' ? Number(estimatedMinutes) : undefined,
      notes: notes.trim() || undefined,
    }
    const draft: TaskDraft =
      kind === 'once'
        ? { ...base, kind: 'once', dueAt: dueAt ? new Date(dueAt).toISOString() : undefined }
        : { ...base, kind: 'cyclic', recurAfterMinutes: toRecurMinutes(recurAmount, recurUnit) }
    onSubmit(draft)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="task-title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <KindToggle value={kind} onChange={setKind} />

      {kind === 'once' ? (
        <div className="space-y-1.5">
          <label htmlFor="due-at" className="text-sm font-medium text-gray-700">Due date (optional)</label>
          <input
            id="due-at"
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-gray-700">Repeat every</span>
          <div className="flex items-center gap-2">
            <input
              id="recur-amount"
              type="number"
              aria-label="Repeat amount"
              value={recurAmount}
              onChange={(e) => setRecurAmount(Number(e.target.value) || 1)}
              min={1}
              className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={recurUnit}
              onChange={(e) => setRecurUnit(e.target.value as RecurUnit)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
          </div>
        </div>
      )}

      <StepList steps={steps} onChange={setSteps} />

      <PriorityUrgencyPicker
        priority={priority}
        urgency={urgency}
        onChange={(p, u) => { setPriority(p); setUrgency(u) }}
      />

      <div className="flex gap-4">
        <div className="space-y-1.5">
          <label htmlFor="est-minutes" className="text-sm font-medium text-gray-700">Est. minutes</label>
          <input
            id="est-minutes"
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value === '' ? '' : Number(e.target.value))}
            min={1}
            placeholder="—"
            className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Any extra context…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Save task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
