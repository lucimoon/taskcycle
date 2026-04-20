import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useFocusStore } from "@/store/focusStore";
import { useSortedTasks, type SortKey } from "@/hooks/useSortedTasks";
import { SortControls } from "@/components/task/SortControls";
import { TaskList } from "@/components/task/TaskList";
import { FocusCard } from "@/components/task/FocusCard";

export function TaskListView() {
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
  const { focusedTaskId } = useFocusStore();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortKey>("priority");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [loadTasks, loadCategories]);

  const focusedTask = focusedTaskId ? tasks.find((t) => t.id === focusedTaskId) ?? null : null;
  const unfocusedTasks = focusedTaskId ? tasks.filter((t) => t.id !== focusedTaskId) : tasks;

  const filteredTasks =
    categoryFilter === null
      ? unfocusedTasks
      : categoryFilter === "__none__"
        ? unfocusedTasks.filter((t) => !t.categoryIds?.length)
        : unfocusedTasks.filter((t) => t.categoryIds?.includes(categoryFilter));
  const sorted = useSortedTasks(filteredTasks, sort);

  function handleDelete(id: string) {
    if (window.confirm("Delete this task?")) {
      removeTask(id);
    }
  }

  return (
    <div className="mesh-bg min-h-screen overflow-x-clip">
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {focusedTask && <FocusCard task={focusedTask} />}
        <div className="flex flex-wrap gap-3">
          {categories.length > 0 && (
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <label
                htmlFor="category-filter"
                className="text-xs font-semibold text-ink/50 shrink-0"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter ?? ""}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="glass-input"
              >
                <option value="">All</option>
                <option value="__none__">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {tasks.length > 0 && (
            <div className="flex-1 min-w-[140px]">
              <SortControls sort={sort} onChange={setSort} />
            </div>
          )}
        </div>
        <TaskList
          tasks={sorted}
          onEdit={(id) => navigate(`/taskcycle/tasks/${id}/edit`)}
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
