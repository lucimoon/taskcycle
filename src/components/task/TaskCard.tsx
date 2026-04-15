import type { Task, Priority, Urgency } from "@/types/task";
import { useCategoryStore } from "@/store/categoryStore";
import { CategoryBadge } from "@/components/category/CategoryBadge";

const PRIORITY_CHIP: Record<Priority, string> = {
  1: "bg-coral text-white",
  2: "bg-amber text-white",
  3: "bg-sunny text-ink",
  4: "bg-ink/10 text-ink",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  1: "P1",
  2: "P2",
  3: "P3",
  4: "P4",
};

const URGENCY_CHIP: Record<Urgency, string> = {
  1: "bg-coral text-white",
  2: "bg-amber text-white",
  3: "bg-sunny text-ink",
  4: "bg-ink/10 text-ink",
};

const URGENCY_LABEL: Record<Urgency, string> = {
  1: "U1",
  2: "U2",
  3: "U3",
  4: "U4",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleExpand?: () => void;
  expanded?: boolean;
  onComplete?: () => void;
  onUncomplete?: () => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleExpand,
  expanded,
  onComplete,
  onUncomplete,
}: TaskCardProps) {
  const completedSteps = task.steps.filter((s) => s.completedAt).length;
  const isDone = Boolean(task.completedAt);
  const isCyclicDone =
    task.kind === "cyclic" &&
    Boolean(task.lastCompletedAt) &&
    Boolean(task.nextDueAt);
  const { categories } = useCategoryStore();
  const category = task.categoryId
    ? categories.find((c) => c.id === task.categoryId)
    : undefined;

  return (
    <div
      className={`card-glass rounded-2xl p-4 space-y-3 transition-all hover:-translate-y-0.5 ${
        isDone || isCyclicDone ? "bg-mint/20" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-bold text-base ${isDone || isCyclicDone ? "line-through text-ink/40" : "text-ink"}`}
          >
            {task.title}
          </span>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
              task.kind === "cyclic"
                ? "bg-lavender/30 text-lavender"
                : "bg-ink/8 text-ink"
            }`}
          >
            {task.kind === "cyclic" ? "↻ Recurring" : "Once"}
          </span>
          {isDone && (
            <span className="rounded-full bg-mint/40 text-ink px-3 py-0.5 text-xs font-semibold">
              ✓ Done
            </span>
          )}
          {isDone && task.kind === "once" && onUncomplete && (
            <button
              type="button"
              onClick={onUncomplete}
              className="text-xs text-ink/40 hover:text-ink underline transition-colors ml-1"
            >
              Undo
            </button>
          )}
          {isCyclicDone && task.nextDueAt && (
            <span className="rounded-full bg-mint/40 text-ink px-3 py-0.5 text-xs font-semibold">
              ✓ Done — recurs {formatDate(task.nextDueAt)}
            </span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task.id)}
            aria-label="Edit task"
            className="rounded-full p-1.5 min-h-[44px] min-w-[44px] text-ink/40 hover:bg-ink/8 hover:text-ink transition-colors text-sm btn-action"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="rounded-full p-1.5 min-h-[44px] min-w-[44px] text-ink/40 hover:bg-coral/10 hover:text-coral transition-colors text-sm btn-action"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {category && <CategoryBadge category={category} />}
        <span
          className={`rounded-full px-3 py-0.5 font-semibold ${PRIORITY_CHIP[task.priority]}`}
        >
          {PRIORITY_LABEL[task.priority]}
        </span>
        <span
          className={`rounded-full px-3 py-0.5 font-semibold ${URGENCY_CHIP[task.urgency]}`}
        >
          {URGENCY_LABEL[task.urgency]}
        </span>
        {task.estimatedMinutes && (
          <span className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-0.5 font-semibold text-ink">
            ~{task.estimatedMinutes}m
          </span>
        )}
        {task.steps.length > 0 && (
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse steps" : "Expand steps"}
            className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-0.5 font-semibold text-ink hover:bg-sunny/40 transition-colors"
          >
            {completedSteps}/{task.steps.length} steps {expanded ? "▲" : "▼"}
          </button>
        )}
        {task.steps.length === 0 && !isDone && onComplete && (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-0.5 font-semibold text-ink hover:bg-mint/40 transition-colors"
          >
            ✓ Mark done
          </button>
        )}
      </div>

      {task.kind === "once" && task.dueAt && (
        <p className="text-xs font-medium text-ink/50">
          Due {formatDate(task.dueAt)}
        </p>
      )}
      {task.kind === "cyclic" && task.nextDueAt && !isCyclicDone && (
        <p className="text-xs font-medium text-ink/50">
          Next due {formatDate(task.nextDueAt)}
        </p>
      )}
    </div>
  );
}
