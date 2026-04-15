# TaskCycle v2 Roadmap

Builds on the completed v1 foundation (M1–M12). All v1 systems — task/reward/category/settings stores, Dexie DB, engagement layer, file sync — are available to reuse. Work in dependency order; later milestones build on earlier ones.

---

## Milestones

1. [Milestone 1 — Persistent Navigation](#milestone-1--persistent-navigation)
2. ✅ [Milestone 2 — Task Completion Polish](#milestone-2--task-completion-polish)
3. [Milestone 3 — Task Focus Mode](#milestone-3--task-focus-mode)
4. [Milestone 4 — Multi-Category Support](#milestone-4--multi-category-support)
5. [Milestone 5 — Sorting Improvements](#milestone-5--sorting-improvements)
6. [Milestone 6 — Matrix Drag-to-Reprioritise](#milestone-6--matrix-drag-to-reprioritise)
7. [Milestone 7 — Recurring Task Instances](#milestone-7--recurring-task-instances)
8. [Milestone 8 — Analytics: Recurring Tasks](#milestone-8--analytics-recurring-tasks)
9. [Milestone 9 — Settings UI](#milestone-9--settings-ui)
10. ✅ [Milestone 10 — Mobile Responsive](#milestone-10--mobile-responsive)
11. [Milestone 11 — Calendar Integration](#milestone-11--calendar-integration)

---

## Milestone 1 — Persistent Navigation

**Goal:** The app header (with nav links to all major views) is visible on every page, not just the task list.

### Problem

Currently the header and nav are rendered inline in `TaskListView` and `MatrixView`. Views like `RewardsView`, `SettingsView`, `CategoryManagementView`, and `CategoryAnalyticsView` each have bespoke back-button headers, making navigation feel fragmented.

### Approach

Extract the header into a shared `AppHeader` component and render it once at the `AppShell` level in `App.tsx`. Individual views drop their local headers and rely on the shared one.

### New Files

**`src/components/AppHeader.tsx`**
- Logo/brand mark + nav links: Tasks (list), Matrix, Rewards, Categories, Analytics, Settings
- Active link highlighted using `useLocation()`
- `ThemeToggle` lives here
- "+ New Task" CTA button navigates to `/tasks/new`

### Changes to Existing Files

- **`src/App.tsx`** — render `<AppHeader />` above `<Routes>` in `AppShell`; pass `theme`/`onThemeToggle` into it
- **`src/views/TaskListView.tsx`** — remove header block; remove Categories/Analytics nav buttons added in v1
- **`src/views/MatrixView.tsx`** — remove header block
- **`src/views/RewardsView.tsx`** — remove bespoke header
- **`src/views/SettingsView.tsx`** — remove bespoke header
- **`src/views/CategoryManagementView.tsx`** — remove bespoke header
- **`src/views/CategoryAnalyticsView.tsx`** — remove bespoke header
- **`src/views/TaskFormView.tsx`** — remove bespoke header if present

### Done When

Navigating to any view shows the shared header. Active nav link is visually indicated. "+ New Task" works from every view. No view has a duplicate or bespoke header.

---

## Milestone 2 — Task Completion Polish

**Goal:** Fix several small gaps in the task completion model: tasks without steps can be completed directly; checked steps/tasks can be unchecked; recurring tasks visually reflect their "complete until recurrence" state.

### Problem

- Tasks with no subtasks have no way to be marked done without adding a dummy step.
- Accidentally completing a step or task cannot be undone.
- Recurring tasks disappear or look identical to once-tasks after completion; users don't know when the next occurrence is coming.

### Changes to Existing Files

**`src/store/taskStore.ts`**
- Add `uncompleteStep(taskId, stepId)` — clears `step.completedAt`
- Add `uncompleteTask(taskId)` — clears `task.completedAt` (once-tasks); for cyclic tasks, clears `lastCompletedAt` and `nextDueAt`

**`src/services/db/taskService.ts`**
- Add `uncompleteTask(id)` mirroring `completeTask` in reverse

**`src/components/task/TaskCard.tsx`**
- Show a "Mark done" button on tasks with no steps (calls `completeTask`)
- Show an "Undo" / uncheck affordance on completed once-tasks
- For completed cyclic tasks: show a "✓ Done — recurs [date/time]" badge instead of just "Done"; use `nextDueAt` for the date copy

**`src/components/task/StepChecklist.tsx`**
- Clicking a completed (checked) step calls `uncompleteStep` instead of completing it again

### Implementation Notes

- **Cyclic task complete state:** show the card in the completed style (`bg-mint/20`, strikethrough title) but with a "Recurs [date]" chip instead of a plain "Done" badge. Use `formatDate(nextDueAt)` already present in `TaskCard`.
- **"Mark done" button:** only show when `task.steps.length === 0 && !task.completedAt`. Use the same style as the expand-steps button (border chip).
- **Undo affordance:** a small "Undo" text link next to the Done badge on completed once-tasks — keeps it discoverable but not prominent.

### Done When

A stepless task can be marked done from `TaskCard`. Completed steps can be unchecked. Completed once-tasks can be undone. A completed recurring task shows "Recurs [date]" instead of plain "Done".

---

## Milestone 3 — Task Focus Mode

**Goal:** A user can designate one task as their current focus. The focused task is highlighted prominently, its active step is auto-advanced after each step completes, and a start/pause control manages the session.

### New Files

**`src/store/focusStore.ts`**
- `focusedTaskId: string | null`
- `setFocus(taskId)`, `clearFocus()`
- Persisted to `settingsStore` / Dexie `settings` table so focus survives refresh

**`src/components/task/FocusCard.tsx`**
- Expanded, prominent version of a task card shown at the top of the task list when a task is focused
- Shows all steps in a linear checklist; active step (first uncompleted) is highlighted
- Start/pause button drives `useStepTimer` for timed steps; for untimed steps, a manual "Done" button completes the step
- After a step is checked off, automatically scrolls to / highlights the next uncompleted step
- "End focus" button calls `clearFocus()`

**`src/hooks/useFocusAutoAdvance.ts`**
- After `completeStep` fires, finds the next uncompleted step and scrolls/focuses it
- No-ops if the task has no remaining steps (triggers `completeTask` flow instead)

### Changes to Existing Files

- **`src/views/TaskListView.tsx`** — if `focusedTaskId` is set, render `<FocusCard />` pinned above the task list; suppress the focused task from the regular list
- **`src/components/task/TaskCard.tsx`** — add a "Focus" button (⚡ icon or similar) that calls `setFocus(task.id)`; hide it on the currently focused task

### Implementation Notes

- **Auto-advance:** on step completion, find `steps.find(s => !s.completedAt)` — if found, emit a DOM focus/scroll event to its checkbox; if none remain, call `completeTask`.
- **Persistence:** store `focusedTaskId` as a settings key (`focus.taskId`) via `settingsService` so it survives reload. Clear it when the task is completed or deleted.
- **Single focus only:** setting focus on a new task replaces the current focus (no multi-focus).

### Done When

Clicking "Focus" on a task pins it as a `FocusCard` at the top. Steps advance automatically on completion. Start/pause controls work for timed steps. "End focus" clears the focus state. Focused task is excluded from the regular list. Focus persists across reload.

---

## Milestone 4 — Multi-Category Support

**Goal:** A task can belong to more than one category. Users can also create a new category inline while filling in the task form, without navigating away.

### Problem

- `categoryId?: string` on `BaseTask` only allows one category. Multi-category requires a schema change.
- Creating a task in a new category currently requires a separate trip to `/categories`.

### Data Model Change

Replace `categoryId?: string` with `categoryIds?: string[]` on `BaseTask`. Dexie supports array fields; add a multi-entry index `*categoryIds` for efficient querying.

### Changes to Existing Files

**`src/types/task.ts`**
- Replace `categoryId?: string` with `categoryIds?: string[]`

**`src/services/db/schema.ts`** + **`src/services/db/db.ts`**
- Add schema v3: `tasks` index updated to include `*categoryIds` (multi-entry); remove `categoryId` index

**`src/services/db/taskService.ts`**
- Update all reads/writes to use `categoryIds`

**`src/services/db/categoryService.ts`**
- `deleteCategory`: update cascade to filter `categoryIds` array rather than clearing a single field

**`src/store/taskStore.ts`**
- Update `completeTask`, `completeStep`, etc. to pass `categoryIds` through

**`src/components/task/TaskForm.tsx`**
- Replace single `CategoryPicker` with a multi-select category picker
- Add an inline "Create new category" affordance below the picker — small text input + color swatch row that creates and immediately selects the new category without navigation

**`src/components/task/TaskCard.tsx`**
- Render a `CategoryBadge` for each entry in `categoryIds` (flex-wrap row)

**`src/components/category/CategoryPicker.tsx`**
- Rewrite as a multi-select: checkboxes per category rather than a `<select>`; selected categories shown as removable chips above the list

**`src/services/db/categoryService.ts`**
- `deleteCategory` cascade: `db.tasks.filter(t => t.categoryIds?.includes(id)).modify(t => { t.categoryIds = t.categoryIds?.filter(c => c !== id) })`

**`src/views/TaskListView.tsx`**
- Category filter: a task matches the active filter if `task.categoryIds?.includes(filterId)`

**`src/services/sync/fileSyncService.ts`**
- No change needed (tasks are serialised as-is)

### Implementation Notes

- **Migration:** existing tasks with `categoryId` set should be migrated in the Dexie v3 upgrade hook: `tasks.toCollection().modify(t => { if (t.categoryId) { t.categoryIds = [t.categoryId] } delete t.categoryId })`.
- **Inline create:** the "Create new category" form in `TaskForm` calls `categoryStore.addCategory()` directly and appends the new id to the form's `categoryIds` state — no route change needed.

### Done When

A task can be saved with multiple categories; all badges appear on `TaskCard`. Filtering by a category in `TaskListView` shows tasks that include that category. Deleting a category removes it from all tasks' `categoryIds` arrays. Existing single-category data migrates correctly. A new category can be created inline during task creation.

---

## Milestone 5 — Sorting Improvements

**Goal:** Priority sort uses due date as a tiebreaker. Recurring tasks that are overdue (past their `nextDueAt`) rank above tasks with future due dates at the same priority level.

### Changes to Existing Files

**`src/hooks/useSortedTasks.ts`**

Update the `'priority'` sort case:

1. Primary: `priority` ascending (1 = highest)
2. Secondary (tiebreaker): effective due date ascending — for once-tasks use `dueAt`; for cyclic tasks use `nextDueAt`; tasks with no date sort last
3. Within same priority + date band: overdue cyclic tasks (where `nextDueAt <= now`) float above once-tasks with `dueAt > now`

```ts
// Pseudocode for the comparator
function priorityComparator(a: Task, b: Task): number {
  if (a.priority !== b.priority) return a.priority - b.priority
  const aDue = effectiveDueDate(a)
  const bDue = effectiveDueDate(b)
  // Overdue cyclic tasks outrank future once-tasks at same priority
  const aOverdue = a.kind === 'cyclic' && a.nextDueAt && new Date(a.nextDueAt) <= new Date()
  const bOverdue = b.kind === 'cyclic' && b.nextDueAt && new Date(b.nextDueAt) <= new Date()
  if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
  if (!aDue && !bDue) return 0
  if (!aDue) return 1
  if (!bDue) return -1
  return aDue.getTime() - bDue.getTime()
}
```

**`src/__tests__/hooks/useSortedTasks.test.ts`**
- Add test cases: same-priority tasks ordered by due date; overdue cyclic above future once at same priority

### Done When

Two tasks with the same priority but different due dates appear with the earlier due date first. An overdue recurring task with the same priority as a future-dated once-task appears above it.

---

## Milestone 6 — Matrix Drag-to-Reprioritise

**Goal:** In the Matrix view, cards can be dragged between quadrants; dropping a card in a new quadrant updates the task's priority and urgency to match that quadrant.

### New Dependency

Add `@dnd-kit/core` and `@dnd-kit/sortable` — lighter than react-beautiful-dnd, works without a legacy React context.

### New Files

**`src/hooks/useMatrixDrop.ts`**
- Wraps `useDrop` (dnd-kit); on drop, calls `taskStore.updateTask(id, { priority, urgency })` with the values corresponding to the target quadrant
- Returns `{ isOver, drop }` ref pair for `MatrixCell`

### Changes to Existing Files

**`src/components/matrix/EisenhowerMatrix.tsx`**
- Wrap in `<DndContext onDragEnd={handleDragEnd}>`
- `handleDragEnd`: extract `taskId` from `active.id`, extract target quadrant from `over.id`, resolve new `{ priority, urgency }` via `getQuadrant` inverse, call `taskStore.updateTask`

**`src/components/matrix/MatrixCell.tsx`**
- Wrap contents in `<DroppableZone id={quadrantKey}>` (dnd-kit `useDroppable`)
- Visual drop target highlight when `isOver`

**`src/components/matrix/MatrixTaskChip.tsx`**
- Wrap in `<DraggableChip id={task.id}>` (dnd-kit `useDraggable`)
- Apply drag ghost styles during drag

**`src/utils/matrixUtils.ts`**
- Add `quadrantToPriorityUrgency(quadrant: QuadrantKey): { priority: Priority; urgency: Urgency }` — inverse of `getQuadrant`

### Implementation Notes

- **Quadrant → priority/urgency mapping:** Q1 (do-first) → `{ priority: 1, urgency: 1 }`; Q2 (schedule) → `{ priority: 1, urgency: 3 }`; Q3 (delegate) → `{ priority: 3, urgency: 1 }`; Q4 (eliminate) → `{ priority: 3, urgency: 3 }`. These are representative mid-range values — preserve the current values if they already fall in the correct quadrant (only update if the quadrant actually changed).
- **Touch support:** dnd-kit includes pointer/touch sensors by default; no extra config needed for mobile.

### Done When

Dragging a chip from one quadrant and dropping it on another updates the task's priority/urgency and moves the chip to the correct quadrant immediately. Dropping back on the same quadrant is a no-op. The update persists across reload.

---

## Milestone 7 — Recurring Task Instances

**Goal:** Each time a recurring task is completed, store a timestamped instance record so the analytics view can show completions over time.

### Problem

Currently `completeTask` on a cyclic task overwrites `lastCompletedAt` in-place. There is no history of past completions. Analytics can only see whether a cyclic task has *ever* been completed, not how often or when.

### New Files

**`src/types/taskInstance.ts`**
- `TaskInstance { id, taskId, completedAt, categoryIds }`
- `categoryIds` is snapshotted from the task at completion time so analytics remain accurate even if categories later change

**`src/services/db/instanceService.ts`**
- `recordInstance(task: CyclicTask): Promise<TaskInstance>`
- `listInstancesForTask(taskId): Promise<TaskInstance[]>`
- `listAllInstances(): Promise<TaskInstance[]>`

### Changes to Existing Files

**`src/services/db/schema.ts`** + **`src/services/db/db.ts`**
- Add schema v4: `taskInstances: '&id, taskId, completedAt'`

**`src/services/db/taskService.ts`**
- In `completeTask`, after updating the cyclic task: call `instanceService.recordInstance(task)` before scheduling `nextDueAt`

**`src/services/sync/fileSyncService.ts`**
- Include `taskInstances` in export/import snapshot

### Done When

Completing a recurring task creates a `TaskInstance` row in IndexedDB. Completing it again on the next cycle creates another row. `listAllInstances()` returns all historical rows. Snapshot export includes instances.

---

## Milestone 8 — Analytics: Recurring Tasks

**Goal:** The analytics view includes recurring task completions (drawn from `TaskInstance` records) alongside once-task completions.

**Depends on:** M7

### Changes to Existing Files

**`src/utils/analyticsUtils.ts`**
- Update `getCategoryCompletionStats` to accept `instances: TaskInstance[]` alongside `tasks`; count each instance as a completion event attributed to its snapshotted `categoryIds`
- Update `getCompletionsByPeriod` similarly — bucket by `instance.completedAt`

**`src/views/CategoryAnalyticsView.tsx`**
- Load `instanceService.listAllInstances()` on mount
- Pass instances to both analytics util functions

### Done When

Completing a recurring task multiple times shows multiple completions in the bar chart. The pie chart reflects recurring task contributions to category totals. `getCategoryCompletionStats` and `getCompletionsByPeriod` tests updated to cover instance data.

---

## Milestone 9 — Settings UI

**Goal:** A full, easy-to-use settings panel surfaces all user preferences in one place with clear labels and controls.

### Problem

The current `SettingsView` has a minimal stub focused on notifications and file sync. Audio, animation toggles, and theme are not accessible from settings. Users have no single place to configure the app.

### Changes to Existing Files

**`src/views/SettingsView.tsx`**

Reorganise into labelled sections:

**Appearance**
- Theme toggle: Classic / Dusk (segmented control)

**Focus & Engagement**
- Animations: on/off toggle
- Sound effects: on/off toggle

**Notifications**
- Enable/disable toggle (existing)
- Permission state badge (existing)

**Data & Sync**
- File sync: directory picker + current path + manual export/import buttons (existing)
- Export data as JSON (manual trigger)
- Import data from JSON

**About**
- App version (read from `package.json` via `import.meta.env` or a build-time constant)

### Implementation Notes

- Theme toggle calls `useTheme().setTheme()`; it currently lives only in `AppHeader` — settings should drive the same store/hook
- All toggles write to `settingsStore` immediately (no Save button needed)
- Section headings: `font-display font-bold text-sm text-ink/50 uppercase tracking-wider` — consistent with existing card header style

### Done When

Opening `/settings` shows all sections. Toggling animations/sounds takes effect immediately. Theme toggle works. Notification toggle requests permission as before. File sync section works as before.

---

## Milestone 10 — Mobile Responsive

**Goal:** The app is fully usable on a small screen. Navigation collapses to a hamburger menu; layout adapts to single-column; touch interactions work cleanly.

### Changes to Existing Files

**`src/components/AppHeader.tsx`** (from M1)
- On `md:` and above: show nav links inline as today
- Below `md:`: show a hamburger button (☰) that toggles a slide-down or overlay drawer containing the nav links and CTA
- Use local `useState` for drawer open/close; close on nav (route change via `useLocation` effect)

**`src/components/matrix/EisenhowerMatrix.tsx`**
- Below `sm:` breakpoint: stack quadrants vertically in Q1 → Q2 → Q3 → Q4 order (most actionable first)
- Each quadrant scrolls independently at full width

**`src/views/TaskListView.tsx`**
- Category filter tabs: scroll horizontally on small screens (`overflow-x-auto flex-nowrap`) rather than wrapping

**`src/components/task/TaskCard.tsx`**
- Ensure action buttons (edit, delete) have adequate tap target size (`min-h-[44px] min-w-[44px]`) per mobile HIG

**`src/views/CategoryAnalyticsView.tsx`**
- Charts: `ResponsiveContainer` already handles width; ensure chart container has adequate height on small screens (min `h-48`)

### Done When

App is usable at 375px viewport width. Nav is accessible via hamburger. Matrix stacks on mobile. Task cards have tap-friendly buttons. No horizontal overflow on any view.

---

## Milestone 11 — Calendar Integration

**Goal:** Any task with an estimated duration can generate a calendar event. The user can open the event directly in Google Calendar or download an `.ics` file to add it to any calendar app.

### New Files

**`src/utils/calendarUtils.ts`**
- `buildGoogleCalendarUrl(task: Task): string` — constructs a `https://calendar.google.com/calendar/render?action=TEMPLATE&...` URL with title, description (notes), start time (now), end time (now + estimatedMinutes), and details
- `buildIcsContent(task: Task): string` — generates a minimal RFC 5545 `.ics` string (VCALENDAR > VEVENT with DTSTART, DTEND, SUMMARY, DESCRIPTION)
- `downloadIcs(task: Task): void` — creates a Blob URL and triggers a download

**`src/__tests__/utils/calendarUtils.test.ts`**
- `buildGoogleCalendarUrl` produces a valid URL with correct query params
- `buildIcsContent` produces a string with required iCal fields

### Changes to Existing Files

**`src/components/task/TaskCard.tsx`**
- Add a calendar icon button (📅) to the action row, visible only when `task.estimatedMinutes` is set
- Opens a small popover/dropdown with two options: "Open in Google Calendar" (link) and "Download .ics"

### Implementation Notes

- **Google Calendar URL params:** `action=TEMPLATE`, `text` (title), `details` (notes), `dates` (start/end in `YYYYMMDDTHHmmssZ` format), `duration` (HHmm)
- **Start time:** default to the current time when the button is clicked (not a stored field)
- **No backend needed:** both approaches are pure client-side
- **`.ics` download:** use `URL.createObjectURL(new Blob([icsContent], { type: 'text/calendar' }))` then `a.click()` + `URL.revokeObjectURL`

### Done When

Clicking the calendar button on a task with `estimatedMinutes` set shows two options. "Open in Google Calendar" opens a pre-filled Google Calendar event in a new tab. "Download .ics" downloads a file that can be imported into any calendar app. Tasks without `estimatedMinutes` do not show the calendar button.

---

## Existing Systems Reference

| System | Path | Notes for v2 |
|---|---|---|
| Task service | `src/services/db/taskService.ts` | Extend for `uncompleteTask` (M2), `categoryIds` (M4) |
| Task store | `src/store/taskStore.ts` | Add `uncompleteStep`, `uncompleteTask` (M2); focus integration (M3) |
| Category service | `src/services/db/categoryService.ts` | Update cascade for `categoryIds[]` (M4) |
| Category store | `src/store/categoryStore.ts` | Inline create support (M4) |
| Settings store | `src/store/settingsStore.ts` | Add `focusedTaskId` key (M3) |
| Settings service | `src/services/settings/settingsService.ts` | Read/write focus key (M3) |
| File sync service | `src/services/sync/fileSyncService.ts` | Include instances in snapshot (M7) |
| useSortedTasks | `src/hooks/useSortedTasks.ts` | Update priority comparator (M5) |
| matrixUtils | `src/utils/matrixUtils.ts` | Add inverse mapping (M6) |
| analyticsUtils | `src/utils/analyticsUtils.ts` | Add instance support (M8) |
| Dexie DB | `src/services/db/db.ts` | v3 (categoryIds, M4), v4 (taskInstances, M7) |
