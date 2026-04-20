import type { Task } from "@/types/task";

export function isComplete(task: Task): boolean {
  if (task.completedAt) return true;
  if (task.kind === "cyclic" && task.nextDueAt) {
    return new Date(task.nextDueAt) > new Date();
  }
  return false;
}
