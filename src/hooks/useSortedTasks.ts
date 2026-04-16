import { useMemo } from "react";
import type { Task } from "@/types/task";
import { isComplete } from "../utils/taskUtils";

export type SortKey =
  | "priority"
  | "urgency"
  | "time"
  | "due"
  | "completion"
  | "createdAt"
  | "default";

type CallbackSortFn = (
  a: Task,
  b: Task,
  ...callbacks: CallbackSortFn[]
) => number;

function getDueString(task: Task): string {
  if (task.kind === "once") return task.dueAt ?? "";
  return task.nextDueAt ?? "";
}

function completionSort(
  a: Task,
  b: Task,
  ...callbacks: CallbackSortFn[]
): number {
  const [callback, ...remainingCallbacks] = callbacks;
  const isCompleteA = isComplete(a);
  const isCompleteB = isComplete(b);
  const bothComplete = isCompleteA && isCompleteB;
  const bothIncomplete = !isCompleteA && !isCompleteB;
  if (bothComplete || bothIncomplete)
    return (callback && callback(a, b, ...remainingCallbacks)) || 0;
  if (isCompleteA) return 1;
  if (isCompleteB) return -1;
  return 0;
}

function createdAtSort(
  a: Task,
  b: Task,
  ...callbacks: CallbackSortFn[]
): number {
  const [callback, ...remainingCallbacks] = callbacks;

  const comparison = a.createdAt.localeCompare(b.createdAt);

  if (comparison === 0) {
    return (callback && callback(a, b, ...remainingCallbacks)) || 0;
  }

  return comparison;
}

function prioritySort(
  a: Task,
  b: Task,
  ...callbacks: CallbackSortFn[]
): number {
  const [callback, ...remainingCallbacks] = callbacks;

  if (a.priority === b.priority) {
    return (callback && callback(a, b, ...remainingCallbacks)) || 0;
  }

  return a.priority - b.priority;
}

function urgencySort(a: Task, b: Task, ...callbacks: CallbackSortFn[]): number {
  const [callback, ...remainingCallbacks] = callbacks;

  if (a.urgency === b.urgency) {
    return (callback && callback(a, b, ...remainingCallbacks)) || 0;
  }

  return a.urgency - b.urgency;
}

function timeSort(a: Task, b: Task, ...callbacks: CallbackSortFn[]): number {
  const [callback, ...remainingCallbacks] = callbacks;

  const aMin = a.estimatedMinutes ?? Infinity;
  const bMin = b.estimatedMinutes ?? Infinity;

  if (aMin === bMin) {
    return (callback && callback(a, b, ...remainingCallbacks)) || 0;
  }

  return aMin - bMin;
}

function dueDateSort(a: Task, b: Task, ...callbacks: CallbackSortFn[]): number {
  const [callback, ...remainingCallbacks] = callbacks;

  const aDate = getDueString(a);
  const bDate = getDueString(b);

  if (!aDate && !bDate) {
    return (callback && callback(a, b, ...remainingCallbacks)) || 0;
  }

  if (!aDate) return 1;
  if (!bDate) return -1;

  const comparison = aDate.localeCompare(bDate);

  if (comparison === 0) {
    return (callback && callback(a, b, ...remainingCallbacks)) || 0;
  }

  return comparison;
}

export function useSortedTasks(tasks: Task[], sort: SortKey): Task[] {
  return useMemo(() => {
    const sorted = [...tasks];
    switch (sort) {
      case "priority":
        return sorted.sort((a, b) =>
          completionSort(a, b, prioritySort, dueDateSort, urgencySort),
        );
      case "urgency":
        return sorted.sort((a, b) =>
          completionSort(a, b, urgencySort, prioritySort, dueDateSort),
        );
      case "time":
        return sorted.sort((a, b) =>
          completionSort(a, b, timeSort, prioritySort, urgencySort),
        );
      case "due":
        return sorted.sort((a, b) =>
          completionSort(a, b, dueDateSort, prioritySort, urgencySort),
        );
      case "completion":
        return sorted.sort(completionSort);
      case "createdAt":
        return sorted.sort(createdAtSort);
      default:
        return sorted.sort();
    }
  }, [tasks, sort]);
}
