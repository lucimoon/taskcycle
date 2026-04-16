# Chore Wheel Roadmap

Living reference for the chore wheel feature — a spin-to-pick interface over recurring due tasks. Each milestone has a "done when" so progress is unambiguous. Work in dependency order — later milestones build on earlier ones.

---

## Milestones

1. [Data Model & DB](#milestone-1--data-model--db)
2. [Spin Engine & Wheel Store](#milestone-2--spin-engine--wheel-store)
3. [Wheel Management UI](#milestone-3--wheel-management-ui)
4. [Spin UI](#milestone-4--spin-ui)
5. [Task Completion Integration](#milestone-5--task-completion-integration)
6. [Micro-interactions](#milestone-6--micro-interactions)

---

## Milestone 1 — Data Model & DB

**Goal:** Persist wheels and their per-round slot state to Dexie.

### New Files

**`src/types/wheel.ts`** (Types)

- `WheelMode = 'free' | 'sequential'`
  - `free`: pool is all due tasks in selected categories on every spin
  - `sequential`: tasks are removed from the pool after being spun until the round is over
- `WheelStatus = 'active' | 'completed'`
- `WheelSlot { taskId: string; completedAt?: string }` — tracks which tasks have been completed this round
- `Wheel { id, name, categoryIds, mode, status, slots, createdAt, completedAt? }`
- `WheelDraft = Omit<Wheel, 'id' | 'createdAt' | 'slots' | 'status'>`

**`src/services/db/wheelService.ts`** (DB Service)

- `listWheels(): Promise<Wheel[]>`
- `createWheel(draft: WheelDraft): Promise<Wheel>`
- `updateWheel(id: string, changes: Partial<Wheel>): Promise<void>`
- `deleteWheel(id: string): Promise<void>`
- `completeSlot(wheelId: string, taskId: string): Promise<void>` — marks a task slot as completed this round; if all slots are done, marks the wheel as `completed`
- `restartWheel(id: string): Promise<void>` — clears all `slots`, resets `status` to `active`, clears `completedAt`

### Changes to Existing Files

- **`src/services/db/schema.ts`** — add `v3` with `wheels: '&id, status, createdAt'`
- **`src/services/db/db.ts`** — add `wheels: EntityTable<Wheel, 'id'>`, register `this.version(3).stores(SCHEMA.v3)`

### Done When

`wheelService` CRUD methods pass unit tests: create, list, completeSlot (including auto-complete of wheel when last slot done), and restartWheel all work against the real Dexie DB.

---

## Milestone 2 — Spin Engine & Wheel Store

**Goal:** Pure logic for picking eligible tasks and a Zustand store wiring it to the DB.

### New Files

**`src/services/wheel/spinEngine.ts`** (Pure Logic)

- `getEligibleTasks(wheel: Wheel, dueTasks: Task[]): Task[]`
  - filters `dueTasks` to those whose `categoryId` is in `wheel.categoryIds`
  - in `sequential` mode: additionally excludes tasks already in `wheel.slots` (i.e. visited this round)
  - in `free` mode: returns all category-matched due tasks every spin
- `pickRandom(pool: Task[]): Task | null` — returns a random item or `null` if pool is empty
- `isWheelComplete(wheel: Wheel, dueTasks: Task[]): boolean` — `true` when eligible pool is empty (all due tasks in scope have been visited this round)

**`src/store/wheelStore.ts`** (Zustand Store)

- `wheels: Wheel[]`
- `loadWheels(): Promise<void>`
- `createWheel(draft: WheelDraft): Promise<void>`
- `deleteWheel(id: string): Promise<void>`
- `restartWheel(id: string): Promise<void>`
- `spinWheel(wheelId: string, dueTasks: Task[]): Task | null` — calls `getEligibleTasks`, calls `pickRandom`, returns the picked task (does not yet mark it complete — that happens on user confirmation)
- `completeWheelTask(wheelId: string, taskId: string): Promise<void>` — calls `wheelService.completeSlot`; also calls `useTaskStore.getState().completeTask(taskId)` so the task's recurrence is scheduled on the main list

### Reuse

- `src/services/scheduler/recurrenceService.ts` — `getDueTasks` is used by the `spinEngine` consumer (passed in as `dueTasks`) to ensure only currently-due cyclic tasks are eligible
- `src/store/taskStore.ts` — `completeTask` called from `completeWheelTask` to unify task completion

### Done When

`spinEngine` unit tests pass: `getEligibleTasks` correctly excludes visited tasks in sequential mode, `isWheelComplete` returns true when pool empties. `wheelStore.spinWheel` returns a task from the correct pool.

---

## Milestone 3 — Wheel Management UI

**Goal:** Users can view, create, and restart wheels; a nav entry point exists.

### New Files

**`src/views/WheelListView.tsx`** (View)

- Lists all wheels with name, mode badge, status badge, category tags
- "New Wheel" button → `WheelSetupView`
- Completed wheels show a "Restart" button and the completion date
- Active wheels show a "Spin" button → `WheelView`
- Delete affordance per wheel

**`src/views/WheelSetupView.tsx`** (View)

- Form: wheel name (text input), mode toggle (`free` / `sequential`), category multi-select
- Submits via `wheelStore.createWheel`
- Navigates back to `WheelListView` on success

**`src/views/WheelView.tsx`** (View, stub)

- Placeholder layout with wheel name and "spin" button — wired up fully in Milestone 4

### Changes to Existing Files

- **`src/App.tsx`** — add routes for `/wheels`, `/wheels/new`, `/wheels/:id`

### Reuse

- `src/components/category/CategoryPicker.tsx` — multi-select for choosing which categories go on the wheel
- `src/store/categoryStore.ts` — loads available categories to populate the picker

### Done When

User can navigate to `/wheels`, create a wheel with a name + categories + mode, see it in the list, and restart a completed wheel. No visual spin yet — that's Milestone 4.

---

## Milestone 4 — Spin UI

**Goal:** The visual spinning wheel and task reveal card are implemented.

### New Files

**`src/components/wheel/ChoreWheel.tsx`** (Component)

- SVG wheel divided into equal slices, one per eligible task
- Each slice labeled with a truncated task title, colored by category
- Accepts `tasks: Task[]`, `spinning: boolean`, `targetIndex: number`
- CSS `transform: rotate()` animation: fast spin easing to a deceleration stop at `targetIndex` slice
- Emits `onSpinComplete` callback when animation ends

**`src/components/wheel/WheelSlice.tsx`** (Component)

- Renders a single SVG pie slice with label
- Props: `index`, `total`, `label`, `color`, `highlighted`

**`src/components/wheel/SpinResult.tsx`** (Component)

- Card revealed after spin — shows task title, category badge, estimated time, notes
- "Complete" button and "Skip" button (skip returns the task to the pool without marking it done)
- Animated slide-up entrance

### Changes to Existing Files

- **`src/views/WheelView.tsx`** — replaces stub: renders `ChoreWheel` with the live eligible task pool (via `useDueTasks` + `getEligibleTasks`), "Spin" button triggers `wheelStore.spinWheel`, shows `SpinResult` on completion

### Reuse

- `src/hooks/useDueTasks.ts` — provides the live pool of due cyclic tasks fed to `getEligibleTasks`
- `src/components/category/CategoryBadge.tsx` — used in `SpinResult` and `WheelSlice`

### Done When

User can open a wheel, see all eligible tasks as slices, press spin, watch the wheel animate to a stop, and see the `SpinResult` card for the landed task.

---

## Milestone 5 — Task Completion Integration

**Goal:** Completing a task on the wheel completes it on the main task list and updates wheel state correctly.

### Changes to Existing Files

- **`src/views/WheelView.tsx`**
  - "Complete" in `SpinResult` calls `wheelStore.completeWheelTask(wheelId, taskId)`
  - On completion, re-derives eligible pool; if pool is now empty, marks wheel complete and shows `WheelCompleteModal` (stub from Milestone 6)
  - "Skip" dismisses `SpinResult` without marking anything done — task remains in pool

- **`src/store/wheelStore.ts`**
  - `completeWheelTask` already calls `useTaskStore.getState().completeTask(taskId)` (wired in M2), confirm it also triggers `loadTasks` so the main list reflects the recurrence reset

### Done When

Completing a task on the wheel: (1) removes it from the current-round pool in sequential mode, (2) reschedules it on the main task list (`nextDueAt` updated), (3) marks the wheel `completed` when the last eligible task is done.

---

## Milestone 6 — Micro-interactions

**Goal:** Spin tick sounds, confetti on task selection, and a full-screen wheel-complete celebration.

### New Files

**`src/components/wheel/WheelCompleteModal.tsx`** (Component)

- Full-screen overlay triggered when a wheel is completed
- Shows wheel name, count of tasks completed, and names of completed tasks
- "Restart" button calls `wheelStore.restartWheel` and dismisses
- "Done" button dismisses without restarting

### Changes to Existing Files

- **`src/services/audio/audioService.ts`**
  - `playSpinTick()` — short percussive click (`'square'` oscillator, ~80ms, ~300Hz); called repeatedly during spin with decreasing frequency to simulate deceleration
  - `playTaskSelected()` — ascending 3-note fanfare (e.g. C5 → E5 → G5) played when the wheel stops
  - `playWheelComplete()` — triumphant 5-note arpeggio + longer sustain, distinct from `playTaskComplete`

- **`src/components/wheel/ChoreWheel.tsx`**
  - During spin animation, fires `playSpinTick()` on each simulated "tick" (use `requestAnimationFrame` to track rotation and fire on each slice boundary crossed)
  - Calls `playTaskSelected()` in `onSpinComplete`

- **`src/components/wheel/SpinResult.tsx`**
  - Fires `fireConfetti()` on mount (task has been selected)

- **`src/views/WheelView.tsx`**
  - Renders `WheelCompleteModal` when `wheel.status === 'completed'`
  - `WheelCompleteModal` mount triggers `playWheelComplete()` + a second `fireConfetti()` burst

### Reuse

- `src/components/feedback/ConfettiEffect.ts` — `fireConfetti()` reused for task-selected burst; call twice with a short delay for the wheel-complete screen
- `src/services/audio/audioService.ts` — extended rather than replaced

### Done When

Spinning the wheel plays decelerating tick sounds; landing on a task fires confetti and a fanfare; completing the final task shows the full-screen celebration with a second confetti burst and the triumph sound.

---

## Existing Systems Reference

| System | File | Used In |
| ------ | ---- | ------- |
| Due task filtering | `src/services/scheduler/recurrenceService.ts` | Milestones 2, 4 |
| Due tasks hook | `src/hooks/useDueTasks.ts` | Milestones 4, 5 |
| Task store + completeTask | `src/store/taskStore.ts` | Milestone 2, 5 |
| Category picker | `src/components/category/CategoryPicker.tsx` | Milestone 3 |
| Category badge | `src/components/category/CategoryBadge.tsx` | Milestone 4 |
| Category store | `src/store/categoryStore.ts` | Milestone 3 |
| Confetti | `src/components/feedback/ConfettiEffect.ts` | Milestone 6 |
| Audio service | `src/services/audio/audioService.ts` | Milestone 6 |
| Dexie DB | `src/services/db/db.ts` | Milestone 1 |
| DB schema | `src/services/db/schema.ts` | Milestone 1 |
