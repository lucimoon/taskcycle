import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { TaskCard } from "@/components/task/TaskCard";

export function HomeView() {
  const { tasks, loadTasks, removeTask } = useTaskStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function handleDelete(id: string) {
    if (window.confirm("Delete this task?")) {
      removeTask(id);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">TaskCycle</h1>
        <button
          onClick={() => navigate("/taskcycle/tasks/new")}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Task
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No tasks yet.</p>
            <p className="text-sm mt-1">Add your first task to get started.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  onEdit={(id) => navigate(`/taskcycle/tasks/${id}/edit`)}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
