# TaskCycle Roadmap

Living reference for a local-first, browser-based task management app designed to help people (especially those with ADHD) manage one-off and recurring tasks with steps, timers, priority/urgency visualization, rewards, and engaging feedback. Each milestone has a "done when" so progress is unambiguous. Work in dependency order — later milestones build on earlier ones.

---

## Design Language

Agreed visual conventions for all milestones to reference. Update this section when a decision changes rather than leaving conflicting notes in milestone entries.

### Color Palette

| Role | Tailwind classes | Use |
|---|---|---|
| Primary action | `blue-600` / `hover:blue-700` | Buttons, active sort pills, nav links |
| Danger | `red-600` | Delete, destructive actions |
| Priority chips | red-700 → orange-600 → yellow-600 → gray-400 (1→4) | Priority and urgency indicators on TaskCard |
| Completion | `green-600` | "Done" badge, completed step text |
| **Matrix Q1** | `red-700` header / `red-50` bg | "Do First" quadrant (high priority + high urgency) |
| **Matrix Q2** | `blue-700` header / `blue-50` bg | "Schedule" quadrant (high priority + low urgency) |
| **Matrix Q3** | `amber-700` header / `amber-50` bg | "Delegate" quadrant (low priority + high urgency) |
| **Matrix Q4** | `gray-500` header / `gray-50` bg | "Eliminate" quadrant (low priority + low urgency) |
| **Reward gold** | `amber-400` → `yellow-300` gradient | Reward notification panel, RewardCard background |
| Neutral surface | `gray-100` / `gray-200` | Page backgrounds, inactive controls |

### Component Conventions

- **Cards:** `rounded-xl shadow-sm border border-gray-200` — consistent across TaskCard, RewardCard
- **Chips/pills:** `rounded-full text-xs font-medium px-2 py-0.5` — used for badges, sort controls, MatrixTaskChip
- **Primary buttons:** `rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700`
- **Segmented controls (view toggles):** two adjacent buttons with shared border, active state `bg-blue-600 text-white`, inactive `bg-white text-gray-600`

### Motion

ADHD users benefit from feedback that is unmissable but not distracting during focus. Rules:
- **Step completion:** brief flash (100ms opacity pulse) — subtle, doesn't interrupt flow
- **Task completion:** larger celebration (confetti, slide-up reward panel) — earned, feels rewarding
- **View transitions:** none by default — instant navigation avoids frustration
- **Reward notification:** slide up from bottom over 200ms, auto-dismiss after 6s with a fade out

### Typography

Tailwind defaults (font-sans). No custom fonts for now — keeps bundle size minimal and avoids layout shift.

---

## Milestones

1. [Milestone 1 — Project Scaffold](#milestone-1--project-scaffold) ✓
2. [Milestone 2 — Task Data Model & Persistence](#milestone-2--task-data-model--persistence) ✓
3. [Milestone 3 — Task CRUD UI](#milestone-3--task-crud-ui) ✓
4. [Milestone 4 — Task List View](#milestone-4--task-list-view)
5. [Milestone 5 — Timer & Scheduler Engine](#milestone-5--timer--scheduler-engine)
6. [Milestone 6 — Eisenhower Matrix View](#milestone-6--eisenhower-matrix-view)
7. [Milestone 7 — Reward System](#milestone-7--reward-system)
8. [Milestone 8 — Notifications & Reminders](#milestone-8--notifications--reminders)
9. [Milestone 9 — Engagement Layer](#milestone-9--engagement-layer)
10. [Milestone 10 — Settings & File Sync](#milestone-10--settings--file-sync)
11. [Milestone 11 — Categories](#milestone-11--categories)
12. [Milestone 12 — Category Analytics](#milestone-12--category-analytics)

---

## Milestone 1 — Project Scaffold

**Goal:** A runnable, test-wired app skeleton with all tooling configured and folder conventions established.

### New Files

**`vite.config.ts`**
- Vite 5 config with React plugin and path aliases (`@/` → `src/`)

**`tailwind.config.ts`**
- Tailwind v4 config with content paths

**`src/main.tsx`**
- App entry point — mounts `<App />` into `#root`

**`src/App.tsx`**
- Top-level shell: router outlet, global providers (Zustand, settings context)

**`src/types/index.ts`**
- Barrel export for all shared TypeScript types (populated in M2)

**`src/components/.gitkeep`**, **`src/views/.gitkeep`**, **`src/hooks/.gitkeep`**, **`src/services/.gitkeep`**, **`src/utils/.gitkeep`**, **`src/assets/.gitkeep`**
- Establish folder structure per SRP conventions (see code-style skill)

**`src/__tests__/App.test.tsx`**
- Smoke test: app mounts without errors

**`e2e/smoke.spec.ts`**
- Playwright smoke test: page loads, title visible

**`playwright.config.ts`**
- Playwright config pointing at local dev server

**`vitest.config.ts`** (or co-located in `vite.config.ts`)
- Vitest + jsdom + React Testing Library setup

**`docs/architecture.md`**
- Mermaid diagram of top-level folder structure and data flow (updated each milestone)

**`.claude/skills/code-style/SKILL.md`**
- Code style conventions (SRP, file size, component vs view vs hook vs service rules)

### Done When

`npm run dev` serves a blank app, `npm test` and `npm run e2e` both pass the smoke tests, and the folder structure matches the conventions in the code-style skill.

---

## Milestone 2 — Task Data Model & Persistence

**Goal:** Tasks can be created, read, updated, and deleted from IndexedDB with a typed service layer.

### New Files

**`src/types/task.ts`**
- `TaskKind: 'once' | 'cyclic'`
- `Priority: 1 | 2 | 3 | 4` (maps to Eisenhower quadrants)
- `Urgency: 1 | 2 | 3 | 4`
- `Step { id, label, durationMinutes?, completedAt? }`
- `BaseTask { id, title, steps, priority, urgency, estimatedMinutes, createdAt, completedAt?, notes? }`
- `OnceTask extends BaseTask { kind: 'once', dueAt?: Date }`
- `CyclicTask extends BaseTask { kind: 'cyclic', recurAfterMinutes: number, lastCompletedAt?: Date, nextDueAt?: Date }`
- `Task = OnceTask | CyclicTask`

**`src/types/reward.ts`**
- `Reward { id, label, description?, linkedTaskIds, dailyCompletionThreshold? }`

**`src/services/db/schema.ts`**
- Dexie schema definition — tables: `tasks`, `rewards`, `settings`

**`src/services/db/db.ts`**
- Dexie instance with versioned migrations

**`src/services/db/taskService.ts`**
- `createTask`, `updateTask`, `deleteTask`, `getTask`, `listTasks`, `completeTask` (handles cyclic recurrence scheduling)

**`src/services/db/rewardService.ts`**
- `createReward`, `updateReward`, `deleteReward`, `listRewards`

**`src/__tests__/services/taskService.test.ts`**
- Unit tests for all task CRUD operations and cyclic recurrence logic

### Done When

All `taskService` tests pass against a real Dexie in-memory instance; creating a cyclic task and calling `completeTask` correctly schedules `nextDueAt`.

---

## Milestone 3 — Task CRUD UI

**Goal:** Users can create, edit, and delete tasks (including steps) through a form UI backed by the live database.

### New Files

**`src/store/taskStore.ts`**
- Zustand store: `tasks[]`, `loadTasks`, `addTask`, `updateTask`, `removeTask`, `completeTask`
- Calls `taskService` and keeps local state in sync

**`src/components/task/TaskForm.tsx`**
- Controlled form: title, kind toggle (one-off / cyclic), due date or recurrence interval, steps list, priority selector, urgency selector, estimated minutes
- Priority and urgency selectors include helper microcopy (e.g. "Important = affects long-term goals; Urgent = needs action today")

**`src/components/task/StepList.tsx`**
- Add/remove/reorder steps; each step has a label and optional duration

**`src/components/task/PriorityUrgencyPicker.tsx`**
- Two 1–4 scales with inline helper text; outputs `{ priority, urgency }`

**`src/components/task/TaskCard.tsx`**
- Compact task summary: title, kind badge, priority/urgency chips, estimated time, step count; edit and delete affordances

**`src/views/TaskFormView.tsx`**
- Full-page view: wraps `TaskForm`, handles create vs edit routing, saves via store

**`src/__tests__/components/TaskForm.test.tsx`**
- Renders, validates required fields, submits correctly for both task kinds

### Implementation Notes

- Due date uses split `date` + `time` inputs (not `datetime-local`). Time defaults to `22:00` so tasks don't silently land at midnight.
- "Add step" focuses the new step's text input immediately via `autoFocus` on mount (see `/ux-patterns` skill).

### Done When

A user can open the app, create both a one-off and a cyclic task with steps, and see them appear as `TaskCard`s. Editing and deleting works. Data persists across page reload.

---

## Milestone 4 — Task List View

**Goal:** Tasks are displayed in a sortable, interactive list; steps can be checked off.

### New Files

**`src/components/task/TaskList.tsx`**
- Renders a list of `TaskCard`s; accepts sorted `Task[]` as props

**`src/components/task/SortControls.tsx`**
- Toggle buttons: sort by priority, urgency, time-to-complete (quick wins first), due date

**`src/components/task/StepChecklist.tsx`**
- Expandable per-task checklist of steps; checking a step calls `completeStep` on the store

**`src/hooks/useSortedTasks.ts`**
- Pure hook: takes `tasks[]` + sort key, returns sorted array

**`src/views/TaskListView.tsx`**
- High-level view: `SortControls` + `TaskList`; subscribes to `taskStore`

**`src/__tests__/hooks/useSortedTasks.test.ts`**
- Tests each sort mode with fixture data

### Changes to Existing Files

- **`src/App.tsx`** — add route for `TaskListView` as the default landing view

### Done When

The landing page shows all tasks sorted by the selected criterion. Checking off a step persists. "Quick wins" sort (ascending estimated time) works correctly.

---

## Milestone 5 — Timer & Scheduler Engine

**Goal:** Step countdown timers work in-browser; cyclic tasks surface as due when their recurrence interval has elapsed.

### New Files

**`src/services/scheduler/recurrenceService.ts`**
- `getDueTasks(tasks: Task[]): Task[]` — returns tasks where `nextDueAt <= now`
- `scheduleNextOccurrence(task: CyclicTask): CyclicTask` — sets `nextDueAt = now + recurAfterMinutes`

**`src/services/scheduler/timerService.ts`**
- `startTimer(durationMs, onTick, onComplete)` — wraps `setInterval`; returns cancel fn
- `formatCountdown(remainingMs): string` — `mm:ss` formatter

**`src/hooks/useStepTimer.ts`**
- Manages countdown state for a single step; calls `timerService`

**`src/hooks/useDueTasks.ts`**
- Polls `recurrenceService` on a 60s interval; returns overdue/due-soon tasks

**`src/components/task/StepTimer.tsx`**
- Countdown display + start/pause/reset controls for a timed step

**`src/__tests__/services/recurrenceService.test.ts`**
- Unit tests: due task detection, next-occurrence scheduling

**`src/__tests__/hooks/useStepTimer.test.ts`**
- Timer ticks, pauses, and completes correctly (using fake timers)

### Changes to Existing Files

- **`src/components/task/StepChecklist.tsx`** — render `StepTimer` when step has `durationMinutes`
- **`src/store/taskStore.ts`** — expose `completeStep(taskId, stepId)` that triggers recurrence scheduling on final step

### Done When

Starting a timed step shows a live countdown. Completing a cyclic task's last step sets the correct `nextDueAt`. `useDueTasks` returns the right tasks when their interval has elapsed.

---

## Milestone 6 — Eisenhower Matrix View

**Goal:** Tasks are visualized in a 2×2 priority/urgency grid; clicking a task opens its detail.

### New Files

**`src/components/matrix/EisenhowerMatrix.tsx`**
- Four-quadrant grid layout; each quadrant labeled (e.g. "Do Now", "Schedule", "Delegate", "Drop")
- Accepts `tasks[]` and renders each in the correct cell via `getQuadrant(priority, urgency)`

**`src/components/matrix/MatrixCell.tsx`**
- Single quadrant: header, scrollable task chip list

**`src/components/matrix/MatrixTaskChip.tsx`**
- Compact chip: title, estimated time badge; click opens task detail

**`src/utils/matrixUtils.ts`**
- `getQuadrant(priority, urgency): QuadrantKey` — pure mapping function

**`src/views/MatrixView.tsx`**
- Full-page view: `EisenhowerMatrix` with nav back to list

**`src/__tests__/utils/matrixUtils.test.ts`**
- All 16 priority/urgency combinations map to the correct quadrant

### Changes to Existing Files

- **`src/App.tsx`** — add route for `MatrixView`; add nav toggle between List and Matrix views

### Implementation Notes

- **Quadrant colors:** use the Design Language matrix color palette — header bg matches the quadrant color (e.g. `bg-red-700 text-white` for Q1), cell bg is the light tint (`bg-red-50`)
- **Layout:** CSS Grid `grid-cols-2 grid-rows-2` filling viewport height minus nav; each quadrant uses `overflow-y-auto` so long lists scroll independently without affecting the grid shape
- **Axis labels:** render `"URGENT →"` centered above the top row and `"IMPORTANT ↑"` rotated along the left edge; use `aria-hidden="true"` since they're decorative orientation aids, not content
- **MatrixTaskChip:** `rounded-full` pill with truncated title (`truncate max-w-[12rem]`) + optional time badge; `onClick` navigates to `/tasks/:id/edit`; hover state lifts with `shadow-md transition-shadow`
- **Empty quadrant state:** dashed border (`border-2 border-dashed`) in the quadrant's accent color + centered `"Nothing here"` in a muted tone — avoids blank void that can feel broken
- **Nav toggle:** add a `"List / Matrix"` segmented control (see Design Language) to the page header in both `TaskListView` and `MatrixView` — not a separate sidebar link. The toggle replaces the "TaskCycle" heading area or sits beside it.
- **Mobile:** `grid-cols-2` collapses to `grid-cols-1` below `sm:` breakpoint. Quadrant order becomes Q1 → Q2 → Q3 → Q4 top-to-bottom (most urgent first).
- **`getQuadrant` mapping:** priority 1–2 = "important", 3–4 = "not important"; urgency 1–2 = "urgent", 3–4 = "not urgent". Q1 = important+urgent, Q2 = important+not urgent, Q3 = not important+urgent, Q4 = not important+not urgent.

### Done When

All tasks appear in the correct quadrant. Navigating between list and matrix views works. No tasks are lost or duplicated across views. Empty quadrant states render correctly. Mobile stacked layout verified at <640px viewport width.

---

## Milestone 7 — Reward System

**Goal:** Users can define rewards and connect them to specific tasks or a daily completion count; completing qualifying tasks surfaces the reward.

### New Files

**`src/store/rewardStore.ts`**
- Zustand store: `rewards[]`, `loadRewards`, `addReward`, `updateReward`, `removeReward`
- `checkRewards(completedTaskId, dailyCount): Reward[]` — returns earned rewards

**`src/components/rewards/RewardForm.tsx`**
- Form: reward label, optional description, link to specific tasks (multi-select) or set daily count threshold

**`src/components/rewards/RewardCard.tsx`**
- Displays reward details and linked tasks/threshold

**`src/components/rewards/RewardList.tsx`**
- List of `RewardCard`s

**`src/components/rewards/RewardNotification.tsx`**
- In-app popup/toast that appears when a reward is earned; shows label and description

**`src/views/RewardsView.tsx`**
- High-level view: `RewardList` + create/edit affordances via `RewardForm`

**`src/hooks/useRewardCheck.ts`**
- After each task completion, calls `checkRewards` and queues `RewardNotification`

**`src/__tests__/store/rewardStore.test.ts`**
- `checkRewards` returns correct rewards for task-linked and count-threshold scenarios

### Changes to Existing Files

- **`src/types/reward.ts`** — add `linkType: 'tasks' | 'count' | 'both'` discriminant field
- **`src/store/taskStore.ts`** — call `checkRewards` inside `completeTask` (store layer, not React layer) so reward detection fires regardless of which UI surface triggers completion
- **`src/App.tsx`** — add route for `RewardsView`; render `RewardNotification` portal at root via `<div id="reward-portal">` appended to `<body>` to avoid CSS stacking context issues

### Implementation Notes

- **Reward notification design:** full-width slide-up panel anchored to the bottom of the viewport (not a small toast). Background: `bg-gradient-to-r from-amber-400 to-yellow-300`. Contains a large reward label (`text-2xl font-bold`), optional description, and a dismiss `×` button. Auto-dismisses after 6 seconds with a fade-out (see Design Language motion rules). Hard to miss — this is intentional for the ADHD dopamine loop.
- **RewardForm linking UX:** `linkType` radio selects between "Linked tasks", "Daily count", or "Both". Linked-tasks section shows a searchable checklist (text input filters task titles in real time, checkboxes select). Daily-count section is a single number input ("Earn after completing N tasks today"). Both sections can be shown simultaneously when `linkType = 'both'`.
- **RewardCard:** `bg-amber-100 border border-amber-200 rounded-xl` card. Shows linked task titles as small chips; daily threshold renders as `"After N tasks today"`. Edit/delete affordances match TaskCard pattern.
- **`useRewardCheck` placement:** logic lives in `rewardStore.checkRewards(completedTaskId, dailyCount)` called from `taskStore.completeTask` after the DB write. This keeps the hook (`useRewardCheck`) thin — it only subscribes to the queue that `checkRewards` populates and renders notifications.
- **Daily count:** query `taskService.listTasks()` filtered by `completedAt >= today midnight` to compute `dailyCount` before calling `checkRewards`.

### Done When

Creating a reward linked to a task and then completing that task shows the reward notification. Notification auto-dismisses after 6 seconds and can be manually dismissed. Daily-count threshold rewards trigger correctly when the threshold is met. Reward data persists across reload.

---

## Milestone 8 — Notifications & Reminders

**Goal:** Browser notifications fire for upcoming one-off task deadlines and when a cyclic task is due.

### New Files

**`src/services/notifications/notificationService.ts`**
- `requestPermission(): Promise<boolean>`
- `scheduleNotification(taskId, title, body, fireAt: Date): void` — uses `setTimeout` relative to now; stores `timeoutId` in a module-scope `Map<taskId, timeoutId>`
- `cancelNotification(taskId): void` — clears the timeout from the map
- `cancelAll(): void` — clears all scheduled notifications (called before rescheduling)

**`src/hooks/useNotificationScheduler.ts`**
- Subscribes to `tasks[]` from `taskStore`; on change, calls `cancelAll()` then reschedules
- Memoizes on task IDs + due dates to avoid spurious reschedules on unrelated store updates
- Schedules `dueAt - 15min` for once-tasks, fires immediately for cyclic tasks where `nextDueAt <= now`

**`src/views/SettingsView.tsx`**
- Minimal stub for M8: single "Notifications" section with an enable/disable toggle
- Toggle calls `requestPermission()` on first enable; shows current permission state (`granted` / `denied` / `default`)
- Shows an inline mockup of what a notification looks like before the user enables (sets expectations, avoids surprise browser prompt)
- Full settings panel added in M10

**`src/__tests__/services/notificationService.test.ts`**
- Permission request and scheduling logic (mocked Notification API and `setTimeout`)
- Verify duplicate scheduling is prevented: scheduling same task twice cancels the first timeout

### Changes to Existing Files

- **`src/App.tsx`** — mount `useNotificationScheduler` at root level; add route `/settings` → `SettingsView`

### Implementation Notes

- **Permission request timing:** never call `requestPermission()` on page load — browsers may block the prompt and users find it jarring. Request only when the user explicitly toggles notifications on in `SettingsView`.
- **Scheduling strategy:** module-scope `Map<taskId, ReturnType<typeof setTimeout>>` in `notificationService` is simpler than a DB-backed approach and survives React re-renders cleanly. On each `useNotificationScheduler` run, call `cancelAll()` first then re-add all future notifications from scratch.
- **Notification copy:**
  - Upcoming once-task: `"Due in 15 min"` / body: task title
  - Overdue cyclic task: `"Due now"` / body: task title
- **No re-fire guard:** since `cancelAll()` + reschedule runs on every task change, a dismissed notification will not re-fire unless the task's due date changes.
- **`useNotificationScheduler` memo key:** `tasks.map(t => \`${t.id}:${t.dueAt ?? t.nextDueAt}\`).join(',')` — only recalculate when IDs or dates shift.

### Done When

With notifications permitted, a task due within 15 minutes triggers a browser notification. A cyclic task that becomes due triggers a notification. No notification fires when permission is denied. A notification does not re-fire after being dismissed (assuming task due date hasn't changed). `SettingsView` is accessible at `/settings` with a working permission toggle.

---

## Milestone 9 — Engagement Layer

**Goal:** Completing a task or step triggers configurable animations and sounds; both are toggleable in settings.

### New Files

**`src/services/audio/audioService.ts`**
- Loads and plays bundled audio clips via Web Audio API
- `play(clipName: AudioClip): void`; no-ops gracefully when audio is disabled

**`src/components/feedback/ConfettiEffect.tsx`**
- Canvas-based confetti burst (Framer Motion or `canvas-confetti` lib); triggered on task complete

**`src/components/feedback/StepCompleteFlash.tsx`**
- Brief highlight/flash animation on step completion

**`src/hooks/useEngagement.ts`**
- Reads settings for audio/animation toggles; exposes `triggerTaskComplete()` and `triggerStepComplete()`

**`src/assets/audio/`**
- `step-complete.mp3`, `task-complete.mp3` — short, royalty-free clips

**`src/__tests__/hooks/useEngagement.test.ts`**
- Calls correct services when enabled; no-ops when disabled

### Changes to Existing Files

- **`src/store/taskStore.ts`** — call `useEngagement.triggerTaskComplete()` after `completeTask`
- **`src/components/task/StepChecklist.tsx`** — call `useEngagement.triggerStepComplete()` after step check

### Done When

Completing a task fires confetti and plays the task-complete sound. Completing a step flashes and plays the step sound. Both animations and sounds can be independently disabled in settings with immediate effect.

---

## Milestone 10 — Settings & File Sync

**Goal:** All user preferences persist; optional File System Access API sync lets users point the app at a local directory for cross-device use.

### New Files

**`src/types/settings.ts`**
- `Settings { audioEnabled, animationsEnabled, notificationsEnabled, syncDirectoryHandle?: FileSystemDirectoryHandle }`

**`src/services/settings/settingsService.ts`**
- Read/write `Settings` to Dexie `settings` table

**`src/services/sync/fileSyncService.ts`**
- `requestDirectory(): Promise<FileSystemDirectoryHandle>`
- `exportSnapshot(handle, tasks, rewards): Promise<void>` — writes `taskcycle-data.json`
- `importSnapshot(handle): Promise<{ tasks, rewards }>` — reads and validates JSON
- `syncIfConfigured(): Promise<void>` — export on change, import on load

**`src/store/settingsStore.ts`**
- Zustand store for `Settings`; persists via `settingsService`

**`src/views/SettingsView.tsx`**
- Toggles: audio, animations, notifications; file sync: pick directory button + current path display; export/import manually

**`src/__tests__/services/fileSyncService.test.ts`**
- Export produces valid JSON; import round-trips tasks and rewards correctly (mocked FileSystem API)

### Changes to Existing Files

- **`src/App.tsx`** — mount `settingsStore` provider; add route for `SettingsView`; call `syncIfConfigured()` on startup
- **`src/services/db/taskService.ts`** — after write operations, call `syncIfConfigured()` if handle is set
- **`src/services/audio/audioService.ts`** — read `audioEnabled` from settings store
- **`src/components/feedback/ConfettiEffect.tsx`** — read `animationsEnabled` from settings store

### Done When

Settings persist across reload. Choosing a local directory causes a `taskcycle-data.json` to be written there after each change. Opening the app with a configured directory and an existing snapshot restores data correctly.

---

## Milestone 11 — Categories

**Goal:** Tasks can be assigned to named, colored categories. Users can filter the task list by category and see at a glance which category each task belongs to.

### New Files

**`src/types/category.ts`**
- `Category { id, name, color, createdAt }`
- `CategoryDraft = Omit<Category, 'id' | 'createdAt'>`

**`src/services/db/categoryService.ts`**
- `createCategory`, `updateCategory`, `deleteCategory`, `getCategory`, `listCategories` — same pattern as `taskService`

**`src/store/categoryStore.ts`**
- Zustand store: `categories[]`, `loadCategories`, `addCategory`, `updateCategory`, `removeCategory`

**`src/components/category/CategoryPicker.tsx`**
- Dropdown/popover to select a category (or "None"); shows color swatch + name

**`src/components/category/CategoryBadge.tsx`**
- Small colored pill showing category name; used in `TaskCard`

**`src/views/CategoryManagementView.tsx`**
- List of categories with add/edit/delete; color picker per category

### Changes to Existing Files

- **`src/types/task.ts`** — add `categoryId?: string` to `BaseTask`
- **`src/services/db/schema.ts`** — add `categories: '&id, name'` to schema v2 migration
- **`src/services/db/db.ts`** — add `categories` table to Dexie class
- **`src/components/task/TaskForm.tsx`** — add `<CategoryPicker />` field
- **`src/components/task/TaskCard.tsx`** — show `<CategoryBadge />` when `categoryId` is set
- **`src/views/TaskListView.tsx`** — add category filter tabs above the task list
- **`src/App.tsx`** — add route for `CategoryManagementView`

### Done When

A task can be assigned a category. The task list can be filtered to show only tasks in a given category. Category badge appears on `TaskCard`. Categories persist across reload.

---

## Milestone 12 — Category Analytics

**Goal:** A visualization view shows task distribution and completion rates per category as either a pie chart or bar histogram, helping users identify neglected or over-focused areas.

### New Files

**`src/utils/analyticsUtils.ts`**
- `getCategoryCompletionStats(tasks, categories): CategoryStat[]`
- `CategoryStat { category, total, completed, completionRate }`
- `getCompletionsByPeriod(tasks, period: 'week' | 'month'): PeriodStat[]`

**`src/components/analytics/CategoryPieChart.tsx`**
- Recharts `PieChart` showing proportion of tasks per category (total or completed)

**`src/components/analytics/CategoryBarChart.tsx`**
- Recharts `BarChart` showing completed tasks per category over time (weekly or monthly buckets)

**`src/views/CategoryAnalyticsView.tsx`**
- Toggle between pie and bar views; period selector (week/month); calls `analyticsUtils` for data

### Changes to Existing Files

- **`src/App.tsx`** — add nav link and route for `CategoryAnalyticsView`
- **`package.json`** — add `recharts` dependency

### Done When

Navigating to the analytics view shows a pie chart of task distribution by category and a bar chart of completions over time. Switching between chart types and periods updates the visualization. View degrades gracefully when no categories are assigned.

---

## Existing Systems Reference

| System | Path | Used In |
|---|---|---|
| Dexie DB instance | `src/services/db/db.ts` | M2, M3, M4, M5, M7, M10 |
| Task service | `src/services/db/taskService.ts` | M2, M3, M4, M5 |
| Task store (Zustand) | `src/store/taskStore.ts` | M3, M4, M5, M7, M9 |
| Reward service | `src/services/db/rewardService.ts` | M2, M7 |
| Reward store | `src/store/rewardStore.ts` | M7, M10 |
| Settings store | `src/store/settingsStore.ts` | M8, M9, M10 |
| Recurrence service | `src/services/scheduler/recurrenceService.ts` | M5, M8 |
| Timer service | `src/services/scheduler/timerService.ts` | M5 |
| Audio service | `src/services/audio/audioService.ts` | M9, M10 |
| Notification service | `src/services/notifications/notificationService.ts` | M8 |
| File sync service | `src/services/sync/fileSyncService.ts` | M10 |
| Matrix utils | `src/utils/matrixUtils.ts` | M6 |
