import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/types/task";

interface Props {
  task: Task;
}

export function MatrixTaskChip({ task }: Props) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "flex items-center gap-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-1.5 text-sm font-medium w-full",
        isDragging
          ? "opacity-50 shadow-lg cursor-grabbing z-50"
          : "cursor-grab",
      ].join(" ")}
      {...listeners}
      {...attributes}
    >
      <button
        type="button"
        onClick={() =>
          !isDragging && navigate(`/taskcycle/tasks/${task.id}/edit`)
        }
        className="truncate flex-1 text-ink text-left transition-all hover:-translate-y-0.5 btn-action"
      >
        {task.title}
      </button>
      {task.estimatedMinutes != null && (
        <span className="shrink-0 rounded-full bg-ink/30 px-2 py-0.5 text-xs font-bold text-white/90">
          {task.estimatedMinutes}m
        </span>
      )}
    </div>
  );
}
