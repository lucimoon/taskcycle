import { useNavigate } from "react-router-dom";
import type { Task } from "@/types/task";

interface Props {
  task: Task;
}

export function MatrixTaskChip({ task }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/taskcycle/tasks/${task.id}/edit`)}
      className="flex items-center gap-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-1.5 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md w-full btn-action"
    >
      <span className="truncate flex-1 text-ink">{task.title}</span>
      {task.estimatedMinutes != null && (
        <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold text-ink">
          {task.estimatedMinutes}m
        </span>
      )}
    </button>
  );
}
