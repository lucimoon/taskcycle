import { useState } from 'react'
import type { Task, TaskDraft, TaskKind, Priority, Urgency, Step } from '@/types/task'
import { KindToggle } from './KindToggle'
import { StepList } from './StepList'
import { PriorityUrgencyPicker } from './PriorityUrgencyPicker'
import { CategoryPicker } from '@/components/category/CategoryPicker'

type RecurUnit = 'minutes' | 'hours' | 'days'

const RECUR_MULTIPLIERS: Record<RecurUnit, number> = {
  minutes: 1,
  hours: 60,
  days: 1440,
}

function toRecurMinutes(amount: number, unit: RecurUnit): number {
  return amount * RECUR_MULTIPLIERS[unit]
}

const inputCls = 'glass-input'
const labelCls = 'text-sm font-bold text-ink'

interface TaskFormProps {
  initial?: Task
  onSubmit: (draft: TaskDraft) => void
  onCancel: () => void
}

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [kind, setKind] = useState<TaskKind>(initial?.kind ?? 'once')
  const initialDueDate =
    initial?.kind === 'once' && initial.dueAt ? initial.dueAt.slice(0, 10) : ''
  const initialDueTime =
    initial?.kind === 'once' && initial.dueAt ? initial.dueAt.slice(11, 16) : '22:00'
  const [dueDate, setDueDate] = useState(initialDueDate)
  const [dueTime, setDueTime] = useState(initialDueTime)
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
  const [categoryId, setCategoryId] = useState<string | undefined>(initial?.categoryId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const base = {
      title: title.trim(),
      steps,
      priority,
      urgency,
      estimatedMinutes: estimatedMinutes !== '' ? Number(estimatedMinutes) : undefined,
      notes: notes.trim() || undefined,
      categoryId,
    }
    const draft: TaskDraft =
      kind === 'once'
        ? { ...base, kind: 'once', dueAt: dueDate ? new Date(`${dueDate}T${dueTime}`).toISOString() : undefined }
        : { ...base, kind: 'cyclic', recurAfterMinutes: toRecurMinutes(recurAmount, recurUnit) }
    onSubmit(draft)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="task-title" className={labelCls}>
          What needs doing? <span className="text-coral">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={inputCls}
        />
      </div>

      <KindToggle value={kind} onChange={setKind} />

      <div className="space-y-1.5">
        <span className="text-sm font-bold text-ink">Category <span className="font-normal text-ink/50">(optional)</span></span>
        <CategoryPicker value={categoryId} onChange={setCategoryId} />
      </div>

      {kind === 'once' ? (
        <div className="space-y-1.5">
          <span className={labelCls}>Due date <span className="font-normal text-ink/50">(optional)</span></span>
          <div className="flex gap-2">
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
              className={inputCls}
            />
            <input
              id="due-time"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              aria-label="Due time"
              className={inputCls}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <span className={labelCls}>Repeat every</span>
          <div className="flex items-center gap-2">
            <input
              id="recur-amount"
              type="number"
              aria-label="Repeat amount"
              value={recurAmount}
              onChange={(e) => setRecurAmount(Number(e.target.value) || 1)}
              min={1}
              className={inputCls}
            style={{ width: '5rem' }}
            />
            <select
              value={recurUnit}
              onChange={(e) => setRecurUnit(e.target.value as RecurUnit)}
              className={inputCls}
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
          <label htmlFor="est-minutes" className={labelCls}>Est. minutes</label>
          <input
            id="est-minutes"
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value === '' ? '' : Number(e.target.value))}
            min={1}
            placeholder="—"
            className={inputCls}
            style={{ width: '7rem' }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className={labelCls}>Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Any extra context…"
          className={inputCls}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white btn-action shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save task
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
