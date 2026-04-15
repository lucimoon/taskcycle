import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useSortedTasks, type SortKey } from "@/hooks/useSortedTasks";
import { SortControls } from "@/components/task/SortControls";
import { TaskList } from "@/components/task/TaskList";
import { ViewToggle } from "@/components/ViewToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Theme } from "@/hooks/useTheme";

interface Props {
  theme: Theme;
  onThemeToggle: () => void;
}

export function TaskListView({ theme, onThemeToggle }: Props) {
  const {
    tasks,
    loadTasks,
    removeTask,
    completeTask,
    uncompleteTask,
    completeStep,
    uncompleteStep,
  } = useTaskStore();
  const { categories, loadCategories } = useCategoryStore();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortKey>("priority");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [loadTasks, loadCategories]);

  const filteredTasks =
    categoryFilter === null
      ? tasks
      : categoryFilter === "__none__"
        ? tasks.filter((t) => !t.categoryId)
        : tasks.filter((t) => t.categoryId === categoryFilter);
  const sorted = useSortedTasks(filteredTasks, sort);

  function handleDelete(id: string) {
    if (window.confirm("Delete this task?")) {
      removeTask(id);
    }
  }

  return (
    <div className="mesh-bg min-h-screen">
      <header className="bg-white/50 backdrop-blur-lg border-b border-white/60 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-xl text-ink tracking-tight">
            TaskCycle
          </span>
          <ViewToggle current="list" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/wheels")}
            className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
          >
            Wheels
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
          >
            Categories
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
          >
            Analytics
          </button>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            onClick={() => navigate("/tasks/new")}
            className="rounded-full bg-coral text-white px-5 py-2.5 text-sm font-semibold btn-action shadow-md"
          >
            + New Task
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all btn-action ${
                categoryFilter === null
                  ? "bg-ink text-white shadow-md"
                  : "bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-white/80"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setCategoryFilter(categoryFilter === cat.id ? null : cat.id)
                }
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all btn-action ${
                  categoryFilter === cat.id
                    ? "text-white shadow-md"
                    : "bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-white/80"
                }`}
                style={
                  categoryFilter === cat.id
                    ? { backgroundColor: cat.color }
                    : undefined
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
        {tasks.length > 0 && <SortControls sort={sort} onChange={setSort} />}
        <TaskList
          tasks={sorted}
          onEdit={(id) => navigate(`/tasks/${id}/edit`)}
          onDelete={handleDelete}
          onComplete={(id) => completeTask(id)}
          onUncomplete={(id) => uncompleteTask(id)}
          onCompleteStep={(taskId, stepId) => completeStep(taskId, stepId)}
          onUncompleteStep={(taskId, stepId) => uncompleteStep(taskId, stepId)}
        />
      </main>
    </div>
  );
}
