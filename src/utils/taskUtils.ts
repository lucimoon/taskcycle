import type { Task } from "@/types/task";

export function isComplete(task: Task): boolean {
  const isDone = Boolean(task.completedAt);
  const isCyclicDone =
    task.kind === "cyclic" &&
    Boolean(task.lastCompletedAt) &&
    Boolean(task.nextDueAt);

  return isDone || isCyclicDone;
}
