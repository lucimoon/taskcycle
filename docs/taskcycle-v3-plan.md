# TaskCycle v3 Roadmap

Builds on v2 (6 of 11 milestones shipped). Carries the 5 incomplete v2 milestones forward and introduces major new capabilities. Where v3 notes overlap with v2 plans, v3 notes take precedence.

---

## Milestones

1. [Milestone 1 — Task Focus Mode](#milestone-1--task-focus-mode) *(from v2 M3)*
2. [Milestone 2 — Matrix Drag-to-Reprioritise](#milestone-2--matrix-drag-to-reprioritise) *(from v2 M6)*
3. [Milestone 3 — Analytics: Recurring Tasks](#milestone-3--analytics-recurring-tasks) *(from v2 M8)*
4. [Milestone 4 — Calendar Integration](#milestone-4--calendar-integration) *(from v2 M11)*
5. [Milestone 5 — Alerts](#milestone-5--alerts)
6. [Milestone 6 — Themes](#milestone-6--themes)
7. [Milestone 7 — Scheduling Enhancements](#milestone-7--scheduling-enhancements)
8. [Milestone 8 — Goals](#milestone-8--goals)
9. [Milestone 9 — Settings UI](#milestone-9--settings-ui)
10. [Milestone 10 — UX Polish](#milestone-10--ux-polish)
11. [Milestone 11 — Task Wheel Clarity](#milestone-11--task-wheel-clarity)
12. [Milestone 12 — Onboarding](#milestone-12--onboarding)
13. [Milestone 13 — Tip Jar](#milestone-13--tip-jar)

---

## Milestone 1 — Task Focus Mode

*(Carried from v2 M3)*

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

- **Auto-advance:** on step completion, find `steps.find(s => !s.completedAt)` — if found, emit a DOM focus/scroll event to its checkbox; if none remain, call `completeTask`
- **Persistence:** store `focusedTaskId` as a settings key (`focus.taskId`) via `settingsService` so it survives reload; clear it when the task is completed or deleted
- **Single focus only:** setting focus on a new task replaces the current focus

### Done When

Clicking "Focus" on a task pins it as a `FocusCard` at the top. Steps advance automatically on completion. Start/pause controls work for timed steps. "End focus" clears the focus state. Focused task is excluded from the regular list. Focus persists across reload.

---

## Milestone 2 — Matrix Drag-to-Reprioritise

*(Carried from v2 M6)*

**Goal:** In the Matrix view, cards can be dragged between quadrants; dropping a card in a new quadrant updates the task's priority and urgency to match that quadrant.

### New Dependency

Add `@dnd-kit/core` and `@dnd-kit/sortable`.

### New Files

**`src/hooks/useMatrixDrop.ts`**

- Wraps `useDrop` (dnd-kit); on drop, calls `taskStore.updateTask(id, { priority, urgency })` with the values corresponding to the target quadrant
- Returns `{ isOver, drop }` ref pair for `MatrixCell`

### Changes to Existing Files

**`src/components/matrix/EisenhowerMatrix.tsx`**

- Wrap in `<DndContext onDragEnd={handleDragEnd}>`
- `handleDragEnd`: extract `taskId` from `active.id`, extract target quadrant from `over.id`, resolve new `{ priority, urgency }` via `quadrantToPriorityUrgency`, call `taskStore.updateTask`

**`src/components/matrix/MatrixCell.tsx`**

- Wrap contents in `<DroppableZone id={quadrantKey}>` (dnd-kit `useDroppable`)
- Visual drop target highlight when `isOver`

**`src/components/matrix/MatrixTaskChip.tsx`**

- Wrap in `<DraggableChip id={task.id}>` (dnd-kit `useDraggable`)
- Apply drag ghost styles during drag

**`src/utils/matrixUtils.ts`**

- Add `quadrantToPriorityUrgency(quadrant: QuadrantKey): { priority: Priority; urgency: Urgency }` — inverse of `getQuadrant`

### Implementation Notes

- Q1 (do-first) → `{ priority: 1, urgency: 1 }`; Q2 (schedule) → `{ priority: 1, urgency: 3 }`; Q3 (delegate) → `{ priority: 3, urgency: 1 }`; Q4 (eliminate) → `{ priority: 3, urgency: 3 }`
- Only update if the quadrant actually changed; dropping on the same quadrant is a no-op
- dnd-kit includes pointer/touch sensors by default; no extra config needed for mobile

### Done When

Dragging a chip from one quadrant and dropping it on another updates the task's priority/urgency and moves the chip to the correct quadrant immediately. Dropping back on the same quadrant is a no-op. The update persists across reload.

---

## Milestone 3 — Analytics: Recurring Tasks

*(Carried from v2 M8 — depends on v2 M7 ✅)*

**Goal:** The analytics view includes recurring task completions (drawn from `TaskInstance` records) alongside once-task completions.

### Changes to Existing Files

**`src/utils/analyticsUtils.ts`**

- Update `getCategoryCompletionStats` to accept `instances: TaskInstance[]` alongside `tasks`; count each instance as a completion event attributed to its snapshotted `categoryIds`
- Update `getCompletionsByPeriod` similarly — bucket by `instance.completedAt`

**`src/views/CategoryAnalyticsView.tsx`**

- Load `instanceService.listAllInstances()` on mount
- Pass instances to both analytics util functions

### Done When

Completing a recurring task multiple times shows multiple completions in the bar chart. The pie chart reflects recurring task contributions to category totals.

---

## Milestone 4 — Calendar Integration

*(Carried from v2 M11)*

**Goal:** Any task with an estimated duration can generate a calendar event. The user can open the event directly in Google Calendar or download an `.ics` file.

### New Files

**`src/utils/calendarUtils.ts`**

- `buildGoogleCalendarUrl(task: Task): string` — constructs a Google Calendar template URL with title, description, start/end time
- `buildIcsContent(task: Task): string` — generates a minimal RFC 5545 `.ics` string
- `downloadIcs(task: Task): void` — creates a Blob URL and triggers a download

**`src/__tests__/utils/calendarUtils.test.ts`**

### Changes to Existing Files

**`src/components/task/TaskCard.tsx`**

- Add a calendar icon button to the action row, visible only when `task.estimatedMinutes` is set
- Opens a small popover with two options: "Open in Google Calendar" and "Download .ics"

### Done When

Clicking the calendar button on a task with `estimatedMinutes` set shows two options. Both work correctly. Tasks without `estimatedMinutes` do not show the button.

---

## Milestone 5 — Alerts

**Goal:** Replace all `window.alert()` / `window.confirm()` calls with a simple in-app modal component.

### New Files

**`src/components/ui/AlertModal.tsx`**

- Props: `message`, `onConfirm`, `onCancel?`, `confirmLabel?`, `cancelLabel?`
- Renders as a centered overlay with backdrop
- Used as the foundation for the Onboarding flow (M12)

### Done When

No `window.alert` or `window.confirm` calls remain in the codebase. All destructive confirmations use `AlertModal`.

---

## Milestone 6 — Themes

**Goal:** Rename "classic" → "light"; add system-aware default with light/dark/system options.

### Changes to Existing Files

**`src/store/settingsStore.ts`**

- Change theme type from `'classic' | 'dusk'` to `'system' | 'light' | 'dark'`
- Default to `'system'`
- Persist selection to Dexie settings table

**`src/components/AppHeader.tsx`**

- Update `ThemeToggle` to a three-way control (system/light/dark)

Any utility or hook that applies the theme class to `document.documentElement`:

- `'system'`: apply `prefers-color-scheme` media query listener; switch to light/dark accordingly
- `'light'` / `'dark'`: apply directly, ignoring system preference

### Migration

Existing users with `'classic'` stored → map to `'light'`; `'dusk'` → map to `'dark'`.

### Done When

Theme defaults to system preference on first load. User can pick system/light/dark in the header. Selection persists. Existing stored theme values migrate correctly.

---

## Milestone 7 — Scheduling Enhancements

**Goal:** Three scheduling improvements: recurring task midnight times, day-of-week/month recurrence, and completion range replacing the urgency UI.

### Changes to Existing Files

**`src/types/task.ts`**

- Add `recurrenceDay?: number` to `CyclicTask` (0–6 for day of week, 1–31 for day of month)
- Add `recurrenceType?: 'daily' | 'weekly' | 'monthly'`
- Add `completionRange?: 'day' | 'week' | 'month' | 'whenever'`

**`src/services/db/taskService.ts`**

- When scheduling `nextDueAt` for a cyclic task, set time to `00:00:00` on the target day (midnight)
- Apply `recurrenceDay` when computing next due date for weekly/monthly types

**`src/components/task/TaskForm.tsx`**

- Remove urgency picker
- Add **Completion Range** selector: "day / week / month / whenever" with helper text explaining the mapping to urgency values
  - `day` → urgency 1, `week` → urgency 2, `month` → urgency 3, `whenever` → urgency 4
  - Tasks without a due date default to `whenever`
- Add recurrence type and day selectors for cyclic tasks

### Done When

Recurring tasks are scheduled to midnight on their recurrence day. Weekly/monthly recurrence can be set to a specific day. Urgency picker is gone; completion range selector replaces it everywhere. Urgency is still stored internally and sort logic is unchanged.

---

## Milestone 8 — Goals

*(Depends on M7)*

**Goal:** An optional feature (enabled in settings) that lets users assign tasks to Goals. Goals carry the priority; tasks derive their priority from their goals.

### Design

- Goals behave like categories: colored, multi-select, managed via their own view
- Priority is set on a Goal (1–4), not on a Task
- A task's effective priority = lowest (highest urgency) priority among its goals; tasks with no goals fall back to a default priority
- Reuse `CategoryPicker` component pattern for `GoalPicker`

### New Files

**`src/types/goal.ts`**

- `Goal { id, name, color, priority: Priority }`

**`src/store/goalStore.ts`**

- CRUD + `listGoals()`, `addGoal()`, `updateGoal()`, `deleteGoal()`

**`src/services/db/goalService.ts`**

- Dexie CRUD for `goals` table

**`src/components/goal/GoalPicker.tsx`**

- Multi-select, same pattern as `CategoryPicker`

### Changes to Existing Files

**`src/services/db/db.ts` / `schema.ts`**

- Add `goals: '&id, name'` table in next schema version

**`src/types/task.ts`**

- Add `goalIds?: string[]`

**`src/components/task/TaskForm.tsx`**

- When Goals are enabled: show `GoalPicker` instead of priority selector

**`src/hooks/useSortedTasks.ts`**

- When Goals enabled: derive effective priority from `goalIds` before sorting

**`src/store/settingsStore.ts`**

- Add `goalsEnabled: boolean` (default `false`)

### Done When

Goals can be enabled in settings. Creating a goal with a priority and assigning tasks to it sorts those tasks accordingly. Tasks with no goals sort with default priority. Disabling goals reverts to manual priority. Deleting a goal removes it from all tasks' `goalIds`.

---

## Milestone 9 — Settings UI

*(Merges v2 M9 + v3 theme + v3 data — v3 notes take precedence on theme options and import/export)*

**Goal:** A full settings panel surfaces all preferences in labelled sections.

### Changes to Existing Files

**`src/views/SettingsView.tsx`**

Sections:

**Appearance**
- System/light/dark theme selector (three-way control, not classic/dusk)

**Focus & Engagement**
- Animations: on/off toggle
- Sound effects: on/off toggle

**Goals**
- Enable/disable Goals feature toggle
- When enabled: link to goal management view

**Notifications**
- Enable/disable toggle (existing)
- Permission state badge (existing)

**Data & Sync**
- File sync: directory picker + current path + manual sync (existing)
- Export full snapshot as JSON
- Import full snapshot from JSON (replaces current data with confirmation via `AlertModal`)

**About**
- App version
- Tip jar link (placeholder for M13)

### Done When

Opening `/settings` shows all sections. All toggles persist. Theme toggle matches M6 options. Import/export JSON works as full DB snapshots. Goals toggle shows/hides goal management.

---

## Milestone 10 — UX Polish

**Goal:** Bundle of UX improvements from v3 notes.

### Changes

**Scroll to top on view change**
- `src/App.tsx` or a router wrapper: add `useEffect` on `location.pathname` that calls `window.scrollTo(0, 0)`

**Sort category filters alphabetically**
- `src/views/TaskListView.tsx`: sort categories by name before rendering filter tabs

**Collapse optional steps by default**
- `src/components/task/TaskForm.tsx`: optional steps section starts collapsed; "Add optional step" expander reveals them

**Desktop sidebar filters**
- `src/views/TaskListView.tsx`: at `lg:` breakpoint, render category filters in a left sidebar column rather than a horizontal tab row above the list

**Show/hide hidden tasks**
- `src/views/TaskListView.tsx`: add a toolbar toggle "Show hidden tasks"; when off (default), filter out tasks where `task.hidden === true`

### Done When

View changes scroll to top. Category filters are alphabetically ordered. Optional steps are collapsed by default in the task form. Wide desktop shows sidebar filters. Hidden tasks can be revealed via a toggle.

---

## Milestone 11 — Task Wheel Clarity

**Goal:** Resolve user confusion between Static and Dynamic wheel modes with clear copy and contextual explanations.

### Changes

Wherever the mode is selected or displayed in the chore wheel UI:

- **Static**: "Tasks stay on the wheel until you complete them or restart the wheel"
- **Dynamic**: "Tasks are automatically added to the wheel when they're created or recur, based on the wheel's categories"

Optionally: add a tooltip or inline info panel on the mode selector explaining the difference before the user commits to a choice.

### Done When

A first-time user can read the mode descriptions and understand the difference without external help.

---

## Milestone 12 — Onboarding

*(Depends on M5 Alerts, M11 Task Wheel Clarity)*

**Goal:** Guide first-time users to their first meaningful action and help them understand engagement features.

### New Files

**`src/views/OnboardingView.tsx`**

Choice screen with two paths:
1. **"Start fresh"**: navigate to task creation form + chore wheel creation
2. **"Load demo"**: load demo tasks + demo chore wheel, navigate to chore wheel, offer a brief guided tour of the engagement features

Both paths include a "Learn how to enable more features" note linking to Settings (for Goals, sounds, animations, etc.).

Include skeptic messaging on the demo path: explain concretely why the tool helps (keeps you engaged with the things you want to do).

**`src/data/demoTasks.ts`**

- A set of representative demo tasks and a demo chore wheel definition that showcase recurring tasks, categories, and the wheel in action

### Changes to Existing Files

**`src/App.tsx`**

- Route guard: if no tasks exist in the DB and onboarding has not been dismissed, redirect to `/onboarding`
- Store `onboardingDismissed` flag in settings

### Done When

A fresh install (empty IndexedDB) redirects to onboarding. Both paths work. Demo data loads correctly and the wheel is populated. Returning users (tasks exist or flag set) skip onboarding entirely.

---

## Milestone 13 — Tip Jar

**Goal:** Provide a way for users who find value in the app to support it, without being intrusive.

### Changes to Existing Files

**`src/views/SettingsView.tsx`**

- In the **About** section: add a "Support this project" link to an external tip service (Ko-fi, Buy Me a Coffee, or similar)
- Optional: a subtle, dismissible banner in the app footer (only shown after N sessions)

### Done When

A support link is visible in Settings > About. Clicking it opens the tip page in a new tab.

---

## Dependency Order

```
M5 (Alerts) ─────────────────────────────────────────► M12 (Onboarding)
M6 (Themes) ─────────────────────────────────────────► M9 (Settings UI)
M7 (Scheduling) ──► M8 (Goals) ──────────────────────► M9 (Settings UI)
M11 (Task Wheel Clarity) ────────────────────────────► M12 (Onboarding)

M1, M2, M3, M4, M10, M13 — no blocking dependencies
```

**Suggested implementation order:**  
M5 → M6 → M7 → M1 → M2 → M3 → M4 → M8 → M9 → M10 → M11 → M12 → M13

---

## Existing Systems Reference

| System | Path | Notes for v3 |
|---|---|---|
| Task service | `src/services/db/taskService.ts` | Midnight scheduling, recurrence day (M7) |
| Task store | `src/store/taskStore.ts` | Goal-derived priority (M8); focus integration (M1) |
| Settings store | `src/store/settingsStore.ts` | Theme type update (M6); `goalsEnabled` flag (M8); `focusedTaskId` (M1) |
| Category picker | `src/components/category/CategoryPicker.tsx` | Reuse pattern for `GoalPicker` (M8) |
| useSortedTasks | `src/hooks/useSortedTasks.ts` | Goal-derived priority sort (M8) |
| analyticsUtils | `src/utils/analyticsUtils.ts` | Instance support (M3) |
| matrixUtils | `src/utils/matrixUtils.ts` | Add `quadrantToPriorityUrgency` (M2) |
| Dexie DB | `src/services/db/db.ts` | Add `goals` table (M8) |
| AppHeader | `src/components/AppHeader.tsx` | Three-way theme toggle (M6) |
| SettingsView | `src/views/SettingsView.tsx` | Full overhaul (M9) |
