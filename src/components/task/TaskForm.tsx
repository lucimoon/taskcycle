import { useState } from "react";
import type {
  Task,
  TaskDraft,
  TaskKind,
  Priority,
  Urgency,
  CompletionRange,
  Step,
} from "@/types/task";
import { KindToggle } from "./KindToggle";
import { StepList } from "./StepList";
import { PriorityUrgencyPicker } from "./PriorityUrgencyPicker";
import { CategoryPicker } from "@/components/category/CategoryPicker";
import { useSettingsStore } from "../../store/settingsStore";

const RANGE_TO_URGENCY: Record<CompletionRange, Urgency> = {
  day: 1, week: 2, month: 3, whenever: 4,
};

const URGENCY_TO_RANGE: Record<Urgency, CompletionRange> = {
  1: 'day', 2: 'week', 3: 'month', 4: 'whenever',
};

const COMPLETION_RANGE_LABELS: Record<CompletionRange, string> = {
  day: 'Today',
  week: 'This week',
  month: 'This month',
  whenever: 'Whenever',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const inputCls = "glass-input";
const labelCls = "text-sm font-bold text-ink";

interface TaskFormProps {
  initial?: Task;
  onSubmit: (draft: TaskDraft) => void;
  onCancel: () => void;
}

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [kind, setKind] = useState<TaskKind>(initial?.kind ?? "once");

  const initialDueDate =
    initial?.kind === "once" && initial.dueAt ? initial.dueAt.slice(0, 10) : "";
  const initialDueTime =
    initial?.kind === "once" && initial.dueAt
      ? initial.dueAt.slice(11, 16)
      : "22:00";
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [dueTime, setDueTime] = useState(initialDueTime);

  // Daily interval: always in whole days
  const [recurDays, setRecurDays] = useState(
    initial?.kind === "cyclic" && !initial.recurrenceType || initial?.kind === "cyclic" && initial.recurrenceType === 'daily'
      ? Math.round((initial as { recurAfterMinutes: number }).recurAfterMinutes / 1440) || 1
      : 1,
  );

  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly'>(
    initial?.kind === 'cyclic' ? (initial.recurrenceType ?? 'daily') : 'daily',
  );
  // 0 = last day of month, 1–31 = specific day; weekly uses 0–6 (Sun–Sat)
  const [recurrenceDay, setRecurrenceDay] = useState<number>(
    initial?.kind === 'cyclic' ? (initial.recurrenceDay ?? 1) : 1,
  );

  const [steps, setSteps] = useState<Step[]>(initial?.steps ?? []);
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 2);
  const [completionRange, setCompletionRange] = useState<CompletionRange>(
    initial?.completionRange ?? (initial ? URGENCY_TO_RANGE[initial.urgency] : 'whenever'),
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    initial?.estimatedMinutes ?? "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initial?.categoryIds ?? [],
  );
  const { settings } = useSettingsStore();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const urgency: Urgency = RANGE_TO_URGENCY[completionRange];
    const base = {
      title: title.trim(),
      steps,
      priority,
      urgency,
      completionRange,
      estimatedMinutes:
        estimatedMinutes !== "" ? Number(estimatedMinutes) : undefined,
      notes: notes.trim() || undefined,
      categoryIds,
    };
    const draft: TaskDraft =
      kind === "once"
        ? {
            ...base,
            kind: "once",
            dueAt: dueDate
              ? new Date(`${dueDate}T${dueTime}`).toISOString()
              : undefined,
          }
        : {
            ...base,
            kind: "cyclic",
            recurAfterMinutes:
              recurrenceType === 'daily' ? recurDays * 1440
              : recurrenceType === 'weekly' ? 7 * 1440
              : 30 * 1440,
            recurrenceType,
            recurrenceDay: recurrenceType !== 'daily' ? recurrenceDay : undefined,
          };
    onSubmit(draft);
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
        <span className="text-sm font-bold text-ink">
          Category <span className="font-normal text-ink/50">(optional)</span>
        </span>
        <CategoryPicker value={categoryIds} onChange={setCategoryIds} />
      </div>

      {kind === "once" ? (
        <div className="space-y-1.5">
          <span className={labelCls}>
            Due date <span className="font-normal text-ink/50">(optional)</span>
          </span>
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
        <div className="space-y-3">
          {/* Recurrence type toggle */}
          <div className="space-y-1.5">
            <span className={labelCls}>Repeats</span>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRecurrenceType(type)}
                  aria-pressed={recurrenceType === type}
                  className={[
                    'rounded-full px-4 py-1.5 text-sm font-semibold transition-all btn-action',
                    recurrenceType === type
                      ? 'bg-coral text-white shadow-md'
                      : 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-coral/10',
                  ].join(' ')}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Daily: whole-day interval only */}
          {recurrenceType === 'daily' && (
            <div className="space-y-1.5">
              <span className={labelCls}>Every</span>
              <div className="flex items-center gap-2">
                <input
                  id="recur-days"
                  type="number"
                  aria-label="Repeat amount"
                  value={recurDays}
                  onChange={(e) => setRecurDays(Math.max(1, Number(e.target.value) || 1))}
                  min={1}
                  className={inputCls}
                  style={{ width: "5rem" }}
                />
                <span className="text-sm font-medium text-ink/70">
                  {recurDays === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          )}

          {/* Weekly: day-of-week picker */}
          {recurrenceType === 'weekly' && (
            <div className="space-y-1.5">
              <span className={labelCls}>On</span>
              <div className="flex gap-1.5">
                {DAY_NAMES.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setRecurrenceDay(i)}
                    aria-pressed={recurrenceDay === i}
                    className={[
                      'rounded-full w-10 h-10 text-xs font-semibold transition-all btn-action',
                      recurrenceDay === i
                        ? 'bg-coral text-white shadow-md'
                        : 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-coral/10',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monthly: specific day (1–31) or last day of month */}
          {recurrenceType === 'monthly' && (
            <div className="space-y-1.5">
              <span className={labelCls}>On day</span>
              <div className="flex items-center gap-2">
                <input
                  id="recurrence-day"
                  type="number"
                  aria-label="Day of month"
                  value={recurrenceDay === 0 ? '' : recurrenceDay}
                  onChange={(e) =>
                    setRecurrenceDay(Math.min(31, Math.max(1, Number(e.target.value) || 1)))
                  }
                  disabled={recurrenceDay === 0}
                  min={1}
                  max={31}
                  placeholder="1"
                  className={[inputCls, recurrenceDay === 0 ? 'opacity-40' : ''].join(' ')}
                  style={{ width: "5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setRecurrenceDay(recurrenceDay === 0 ? 1 : 0)}
                  aria-pressed={recurrenceDay === 0}
                  className={[
                    'rounded-full px-4 py-1.5 text-sm font-semibold transition-all btn-action',
                    recurrenceDay === 0
                      ? 'bg-coral text-white shadow-md'
                      : 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-coral/10',
                  ].join(' ')}
                >
                  Last day
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <StepList steps={steps} onChange={setSteps} />

      {/* Completion range */}
      <div className="space-y-2">
        <span className={labelCls}>Complete by</span>
        <div className="flex gap-2 flex-wrap">
          {(['day', 'week', 'month', 'whenever'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setCompletionRange(range)}
              aria-pressed={completionRange === range}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-all btn-action',
                completionRange === range
                  ? 'bg-amber text-white shadow-md'
                  : 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-amber/10',
              ].join(' ')}
            >
              {COMPLETION_RANGE_LABELS[range]}
            </button>
          ))}
        </div>
      </div>

      {settings.matrixMenuEnabled && (
        <PriorityUrgencyPicker
          priority={priority}
          onChange={setPriority}
        />
      )}

      <div className="flex gap-4">
        <div className="space-y-1.5">
          <label htmlFor="est-minutes" className={labelCls}>
            Est. minutes
          </label>
          <input
            id="est-minutes"
            type="number"
            value={estimatedMinutes}
            onChange={(e) =>
              setEstimatedMinutes(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            min={1}
            placeholder="—"
            className={inputCls}
            style={{ width: "7rem" }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className={labelCls}>
          Notes <span className="font-normal text-ink/50">(optional)</span>
        </label>
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
  );
}
