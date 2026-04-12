# Code Style

Conventions for the TaskCycle codebase. Apply these in every file you write or modify. The goal is small, composable units where each file does one thing well.

---

## Layer Model

| Layer | Location | Responsibility | May Import |
|---|---|---|---|
| **Type** | `src/types/` | TypeScript interfaces and unions only — no logic | nothing |
| **Util** | `src/utils/` | Pure functions, no side effects, no React | types |
| **Service** | `src/services/` | I/O, external APIs, Dexie, audio, FS — no React | types, utils |
| **Hook** | `src/hooks/` | React state/effects that encapsulate behaviour | types, utils, services, other hooks |
| **Component** | `src/components/` | Focused, reusable UI unit | types, utils, hooks, other components |
| **View** | `src/views/` | Page-level glue — composes components, subscribes to stores | anything |
| **Store** | `src/store/` | Zustand slices — one file per domain | types, services |

**Rules:**
- Services must not import from React or hooks.
- Components must not import directly from services — go through a hook or store.
- Views own routing and layout; they should contain minimal logic beyond wiring.

---

## File Size

- Target: **≤ 150 lines** per file.
- If a file is growing past ~120 lines, look for a natural split: a sub-component, a helper hook, or a util function.
- Long `switch`/`map` tables are acceptable exceptions — don't split for line count alone when context is essential.

---

## Component Conventions

```tsx
// Good: focused, named props interface
interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) { ... }
```

- One component per file; filename matches component name.
- Props interface defined in the same file, above the component.
- No default exports — named exports only.
- Co-locate test file: `TaskCard.test.tsx` next to `TaskCard.tsx`.

---

## Hook Conventions

- Prefix with `use`; one concern per hook.
- Return plain values or stable callbacks — avoid returning objects with many fields; prefer tuples or narrow return types.
- Side effects only inside `useEffect`; effects must clean up timers/subscriptions.

```ts
// Good
export function useStepTimer(durationMs: number) {
  const [remaining, setRemaining] = useState(durationMs);
  const [running, setRunning] = useState(false);
  // ...
  return { remaining, running, start, pause, reset };
}
```

---

## Service Conventions

- Export plain async functions — not classes.
- One domain per file (`taskService.ts`, `audioService.ts`).
- Never throw user-facing strings; throw typed errors and let the caller decide presentation.

```ts
// Good
export async function createTask(draft: Omit<Task, 'id' | 'createdAt'>): Promise<Task> { ... }
```

---

## Naming

| Thing | Convention | Example |
|---|---|---|
| Component / View | PascalCase | `TaskCard`, `MatrixView` |
| Hook | camelCase with `use` prefix | `useSortedTasks` |
| Service function | camelCase verb | `completeTask`, `scheduleNotification` |
| Type / Interface | PascalCase | `CyclicTask`, `QuadrantKey` |
| Zustand store | camelCase with `Store` suffix | `taskStore` |
| CSS / Tailwind | utility-first inline; extract to component only if reused ≥ 3× |  |

---

## Testing

- **Unit tests** (`src/__tests__/`): Vitest + React Testing Library. Test behaviour, not implementation.
- **E2E tests** (`e2e/`): Playwright. Cover critical user flows end-to-end.
- Co-locate component tests alongside the component when the test file would be small (< 60 lines); otherwise place in `src/__tests__/`.
- Use real Dexie (in-memory) for service tests — no mocking the DB layer.
- Mock the `Notification` API, `FileSystem` API, and audio for unit tests.

---

## Imports

- Use the `@/` alias for all `src/` imports: `import { Task } from '@/types/task'`.
- No barrel `index.ts` files inside feature subdirectories — import directly by file.
- Group imports: external libs → `@/types` → `@/utils` → `@/services` → `@/hooks` → `@/components`.
