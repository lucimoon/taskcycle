import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { TaskForm } from "@/components/task/TaskForm";
import type { TaskDraft } from "@/types/task";

export function TaskFormView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, loadTasks, addTask, updateTask } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const existing = id ? tasks.find((t) => t.id === id) : undefined;

  async function handleSubmit(draft: TaskDraft) {
    if (id && existing) {
      await updateTask(id, draft as Parameters<typeof updateTask>[1]);
    } else {
      await addTask(draft);
    }
    navigate("/taskcycle");
  }

  if (id && tasks.length > 0 && !existing) {
    navigate("/taskcycle");
    return null;
  }

  return (
    <div className="mesh-bg min-h-screen">
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="card-glass rounded-2xl p-6">
          <TaskForm
            initial={existing}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/taskcycle")}
          />
        </div>
      </main>
    </div>
  );
}
