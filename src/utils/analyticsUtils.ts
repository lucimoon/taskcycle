import type { Task } from "@/types/task";
import type { Category } from "@/types/category";

export interface CategoryStat {
  category: Category;
  total: number;
  completed: number;
  completionRate: number;
}

export interface PeriodStat {
  label: string;
  completions: Record<string, number>;
}

const UNCATEGORIZED: Category = {
  id: "__none__",
  name: "Uncategorized",
  color: "#6b7280",
  createdAt: "",
};

export function getCategoryCompletionStats(
  tasks: Task[],
  categories: Category[],
): CategoryStat[] {
  const all = [...categories, UNCATEGORIZED];
  return all
    .map((cat) => {
      const bucket =
        cat.id === "__none__"
          ? tasks.filter((t) => !t.categoryIds?.length)
          : tasks.filter((t) => t.categoryIds?.includes(cat.id));
      const total = bucket.length;
      const onceDone = bucket.filter((t) => t.kind === "once" && t.completedAt).length;
      const cyclicDone = bucket
        .filter((t) => t.kind === "cyclic")
        .reduce((sum, t) => sum + (t.completionDates?.length ?? 0), 0);
      const completed = onceDone + cyclicDone;
      return {
        category: cat,
        total,
        completed,
        completionRate: total > 0 ? completed / total : 0,
      };
    })
    .filter((s) => s.total > 0 || s.completed > 0);
}

export function getCompletionsByPeriod(
  tasks: Task[],
  categories: Category[],
  period: "week" | "month",
): PeriodStat[] {
  const onceTasks = tasks.filter((t) => t.kind === "once" && t.completedAt);
  const cyclicTasks = tasks.filter((t) => t.kind === "cyclic");
  const now = new Date();
  const allCategoryIds = [...categories.map((c) => c.id), "__none__"];

  function countInBucket(
    start: Date,
    end: Date,
    completions: Record<string, number>,
  ) {
    // Once task completions
    for (const t of onceTasks) {
      const completedAt = new Date(t.completedAt!);
      if (completedAt >= start && completedAt < end) {
        const keys = t.categoryIds?.length ? t.categoryIds : ["__none__"];
        for (const key of keys) {
          completions[key] = (completions[key] ?? 0) + 1;
        }
      }
    }
    // Cyclic task completions — each entry in completionDates is one event
    for (const t of cyclicTasks) {
      for (const dateStr of t.completionDates ?? []) {
        const completedAt = new Date(dateStr);
        if (completedAt >= start && completedAt < end) {
          const keys = t.categoryIds?.length ? t.categoryIds : ["__none__"];
          for (const key of keys) {
            completions[key] = (completions[key] ?? 0) + 1;
          }
        }
      }
    }
  }

  if (period === "week") {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);

      const label = d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const completions: Record<string, number> = {};
      for (const id of allCategoryIds) {
        completions[id] = 0;
      }
      countInBucket(d, next, completions);
      return { label, completions };
    });
  }

  // Month: last 30 days in ~weekly buckets (4 buckets of 7–8 days)
  const buckets = [
    { start: 22, end: 30 },
    { start: 15, end: 22 },
    { start: 8, end: 15 },
    { start: 0, end: 8 },
  ].map(({ start, end }) => {
    const bucketStart = new Date(now);
    bucketStart.setDate(bucketStart.getDate() - end);
    bucketStart.setHours(0, 0, 0, 0);
    const bucketEnd = new Date(now);
    bucketEnd.setDate(bucketEnd.getDate() - start + 1);
    bucketEnd.setHours(0, 0, 0, 0);
    return { bucketStart, bucketEnd };
  });

  return buckets.map(({ bucketStart, bucketEnd }) => {
    const label = bucketStart.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const completions: Record<string, number> = {};
    for (const id of allCategoryIds) {
      completions[id] = 0;
    }
    countInBucket(bucketStart, bucketEnd, completions);
    return { label, completions };
  });
}
