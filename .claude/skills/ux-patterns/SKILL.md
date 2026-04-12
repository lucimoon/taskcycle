# UX Patterns

Interaction patterns used in TaskCycle. Apply these when building new UI — they encode decisions already validated in this codebase.

---

## Focus Management

**Rule:** When a user action creates a new interactive element, move focus to it immediately.

**Implementation:** Use `autoFocus` on the input inside the newly mounted component. React's `autoFocus` fires only on initial DOM mount, so it won't steal focus on re-renders of existing elements.

```tsx
// StepList.tsx — track which step was just added
const [lastAddedId, setLastAddedId] = useState<string | null>(null)

function addStep() {
  const newStep = { id: crypto.randomUUID(), label: '' }
  onChange([...steps, newStep])
  setLastAddedId(newStep.id)
}

// StepRow.tsx — autoFocus on mount when it's the new step
<input autoFocus={step.id === lastAddedId} ... />
```

**When to apply:** Any "add item to list" interaction: add step, add tag, add reward, add category.

---

## Sensible Defaults

**Rule:** Pre-fill fields with the most common, low-regret choice. Reduce blank-slate paralysis.

**Examples in this codebase:**
- Priority defaults to `2` (Contributes to goals) — not the most extreme
- Urgency defaults to `2` (This week) — not the most extreme
- Due time defaults to `22:00` (10 PM) when only a date is chosen — avoids midnight surprises

**Implementation:** Split `datetime-local` into separate `date` + `time` inputs so the time default is always explicit:

```tsx
const [dueDate, setDueDate] = useState('')
const [dueTime, setDueTime] = useState('22:00')  // default 10 PM
// On submit:
dueAt: dueDate ? new Date(`${dueDate}T${dueTime}`).toISOString() : undefined
```

**When to apply:** Any form field with a clear "most common" value. Don't default to extremes.

---

## Progressive Disclosure

**Rule:** Hide detail until the user explicitly asks for it. Keep the primary view scannable.

**Implementation:** Use local `expanded` state in a wrapper component (e.g. `TaskListItem`). The expand trigger (chevron, step count badge) and the expandable content (StepChecklist) live in the same wrapper.

```tsx
// TaskListItem.tsx
const [expanded, setExpanded] = useState(false)
<TaskCard onToggleExpand={() => setExpanded(e => !e)} expanded={expanded} />
{expanded && <StepChecklist ... />}
```

**When to apply:** Any secondary content that's relevant but not always needed: steps, notes, reward details, analytics breakdowns.

---

## Submit Guard

**Rule:** Disable (don't hide) the submit button when the form is invalid. Show it grayed, keep it discoverable.

```tsx
<button type="submit" disabled={!title.trim()} className="... disabled:opacity-40 disabled:cursor-not-allowed">
  Save task
</button>
```

**When to apply:** All primary form actions. Never hide the submit button — hiding removes the affordance.

---

## Accessible Toggle Buttons

**Rule:** Use `aria-pressed` on toggle/selector buttons. Never use only color to communicate state.

```tsx
<button
  type="button"
  aria-pressed={value === kind}
  onClick={() => onChange(kind)}
  className={value === kind ? 'bg-white shadow-sm' : 'text-gray-500'}
>
  {label}
</button>
```

**When to apply:** KindToggle, SortControls, PriorityUrgencyPicker, any multi-option selector.

---

## Icon-Only Buttons

**Rule:** Always add `aria-label` to buttons that contain only an icon or emoji.

```tsx
<button aria-label="Delete task" onClick={() => onDelete(task.id)}>🗑️</button>
<button aria-label="Edit task" onClick={() => onEdit(task.id)}>✏️</button>
```

**When to apply:** Edit, delete, up/down reorder, close, expand/collapse buttons.

---

## Confirmation Before Destructive Actions

**Rule:** Confirm before irreversible actions. For MVP, `window.confirm` is acceptable. For polish, replace with an inline confirmation UI (e.g. button transforms to "Are you sure? [Yes] [No]").

```tsx
function handleDelete(id: string) {
  if (window.confirm('Delete this task?')) removeTask(id)
}
```

**When to apply:** Delete task, delete reward, delete category, clear all data.

---

## Inline Microcopy

**Rule:** Place help text directly next to the control it describes — not in a tooltip, not in a separate help section.

**Example:** PriorityUrgencyPicker buttons each show a number + short label ("High impact", "This week") inline, not on hover.

**When to apply:** Any field where the valid values aren't self-evident: priority/urgency scales, recurrence intervals, category color pickers.
