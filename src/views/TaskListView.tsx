import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "@/context/ConfirmContext";
import { useTaskStore } from "@/store/taskStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useFocusStore } from "@/store/focusStore";
import { useGoals } from "@/hooks/useGoals";
import { useSettingsStore } from "@/store/settingsStore";
import { useTaskListFilterStore } from "@/store/taskListFilterStore";
import { useSortedTasks } from "@/hooks/useSortedTasks";
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
  const { settings } = useSettingsStore();
  const { goals, getEffectivePriority } = useGoals();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { sort, categoryFilter, goalFilter, setSort, setCategoryFilter, setGoalFilter } =
    useTaskListFilterStore();

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [loadTasks, loadCategories]);

  const focusedTask = focusedTaskId ? tasks.find((t) => t.id === focusedTaskId) ?? null : null;
  const unfocusedTasks = focusedTaskId ? tasks.filter((t) => t.id !== focusedTaskId) : tasks;

  const filteredByCategory =
    categoryFilter === null
      ? unfocusedTasks
      : categoryFilter === "__none__"
        ? unfocusedTasks.filter((t) => !t.categoryIds?.length)
        : unfocusedTasks.filter((t) => t.categoryIds?.includes(categoryFilter));

  const filteredTasks =
    goalFilter === null
      ? filteredByCategory
      : filteredByCategory.filter((t) => t.goalIds?.includes(goalFilter));
  const sorted = useSortedTasks(
    filteredTasks,
    sort,
    settings.goalsEnabled ? getEffectivePriority : undefined,
  );

  function handleDelete(id: string) {
    confirm("Delete this task?", () => removeTask(id), { confirmLabel: "Delete" });
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
          {settings.goalsEnabled && goals.length > 0 && (
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <label
                htmlFor="goal-filter"
                className="text-xs font-semibold text-ink/50 shrink-0"
              >
                Goal
              </label>
              <select
                id="goal-filter"
                value={goalFilter ?? ""}
                onChange={(e) => setGoalFilter(e.target.value || null)}
                className="glass-input"
              >
                <option value="">All</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
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
