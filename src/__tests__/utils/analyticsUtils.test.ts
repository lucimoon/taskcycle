import {
  getCategoryCompletionStats,
  getCompletionsByPeriod,
} from "@/utils/analyticsUtils";
import type { Task } from "@/types/task";
import type { Category } from "@/types/category";

const cat1: Category = {
  id: "cat-1",
  name: "Work",
  color: "#3b82f6",
  createdAt: "",
};
const cat2: Category = {
  id: "cat-2",
  name: "Health",
  color: "#22c55e",
  createdAt: "",
};

function makeTask(
  overrides: Partial<Task> & { kind?: "once" | "cyclic" },
): Task {
  const kind = overrides.kind ?? "once";
  const base = {
    id: crypto.randomUUID(),
    title: "Task",
    steps: [],
    priority: 2 as const,
    urgency: 2 as const,
    createdAt: new Date().toISOString(),
  };
  if (kind === "cyclic") {
    return {
      ...base,
      kind: "cyclic",
      recurAfterMinutes: 60,
      ...overrides,
    } as Task;
  }
  return { ...base, kind: "once", ...overrides } as Task;
}

describe("getCategoryCompletionStats", () => {
  it("returns stats for each category with tasks", () => {
    const tasks = [
      makeTask({ categoryId: "cat-1" }),
      makeTask({ categoryId: "cat-1", completedAt: new Date().toISOString() }),
      makeTask({ categoryId: "cat-2" }),
    ];
    const stats = getCategoryCompletionStats(tasks, [cat1, cat2]);
    const work = stats.find((s) => s.category.id === "cat-1")!;
    expect(work.total).toBe(2);
    expect(work.completed).toBe(1);
    expect(work.completionRate).toBe(0.5);

    const health = stats.find((s) => s.category.id === "cat-2")!;
    expect(health.total).toBe(1);
    expect(health.completed).toBe(0);
  });

  it("includes uncategorized bucket for tasks without categoryId", () => {
    const tasks = [
      makeTask({ categoryId: undefined }),
      makeTask({
        categoryId: undefined,
        completedAt: new Date().toISOString(),
      }),
    ];
    const stats = getCategoryCompletionStats(tasks, []);
    expect(stats).toHaveLength(1);
    const none = stats[0];
    expect(none.category.id).toBe("__none__");
    expect(none.total).toBe(2);
    expect(none.completed).toBe(1);
  });

  it("omits categories with no tasks", () => {
    const tasks = [makeTask({ categoryId: "cat-1" })];
    const stats = getCategoryCompletionStats(tasks, [cat1, cat2]);
    expect(stats.find((s) => s.category.id === "cat-2")).toBeUndefined();
  });

  it("returns empty array when no tasks", () => {
    const stats = getCategoryCompletionStats([], [cat1, cat2]);
    expect(stats).toHaveLength(0);
  });

  it("completionRate is 0 for categories with no completed tasks", () => {
    const tasks = [makeTask({ categoryId: "cat-1" })];
    const stats = getCategoryCompletionStats(tasks, [cat1]);
    expect(stats[0].completionRate).toBe(0);
  });
});

describe("getCompletionsByPeriod — week", () => {
  it("returns 7 buckets", () => {
    const stats = getCompletionsByPeriod([], [], "week");
    expect(stats).toHaveLength(7);
  });

  it("counts completions in the correct day bucket", () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const tasks = [
      makeTask({ categoryId: "cat-1", completedAt: today.toISOString() }),
    ];
    const stats = getCompletionsByPeriod(tasks, [cat1], "week");
    const lastBucket = stats[stats.length - 1];
    expect(lastBucket.completions["cat-1"]).toBe(1);
  });

  it("puts uncategorized completions under __none__", () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const tasks = [makeTask({ completedAt: today.toISOString() })];
    const stats = getCompletionsByPeriod(tasks, [], "week");
    const lastBucket = stats[stats.length - 1];
    expect(lastBucket.completions["__none__"]).toBe(1);
  });
});

describe("getCompletionsByPeriod — month", () => {
  it("returns 4 buckets", () => {
    const stats = getCompletionsByPeriod([], [], "month");
    expect(stats).toHaveLength(4);
  });

  it("counts a completion from today in the last bucket", () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const tasks = [
      makeTask({ categoryId: "cat-1", completedAt: today.toISOString() }),
    ];
    const stats = getCompletionsByPeriod(tasks, [cat1], "month");
    const lastBucket = stats[stats.length - 1];
    expect(lastBucket.completions["cat-1"]).toBe(1);
  });
});
