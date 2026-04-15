import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWheelStore } from "@/store/wheelStore";
import { useTaskStore } from "@/store/taskStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useDueTasks } from "@/hooks/useDueTasks";
import { getEligibleTasks } from "@/services/wheel/spinEngine";
import type { Task } from "@/types/task";
import { ChoreWheel, SPIN_DURATION } from "@/components/wheel/ChoreWheel";
import { SpinResult } from "@/components/wheel/SpinResult";
import { WheelCompleteModal } from "@/components/wheel/WheelCompleteModal";

type SpinState = "idle" | "spinning" | "result";

export function WheelView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { wheels, loadWheels, spinWheel, completeWheelTask, restartWheel } =
    useWheelStore();
  const { tasks, loadTasks } = useTaskStore();
  const { categories, loadCategories } = useCategoryStore();
  const dueTasks = useDueTasks(tasks);

  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [rotation, setRotation] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    loadWheels();
    loadTasks();
    loadCategories();
  }, [loadWheels, loadTasks, loadCategories]);

  const wheel = wheels.find((w) => w.id === id);

  if (!wheel) {
    return (
      <div className="mesh-bg min-h-screen flex items-center justify-center">
        <p className="text-ink/50">Wheel not found.</p>
      </div>
    );
  }

  const eligible = getEligibleTasks(wheel, dueTasks);
  const categoryColors = Object.fromEntries(
    categories.map((c) => [c.id, c.color]),
  );
  const completedCount = wheel.slots.filter((s) => s.completedAt).length;
  const completedTaskTitles = wheel.slots
    .filter((s) => s.completedAt)
    .map((s) => tasks.find((t) => t.id === s.taskId)?.title ?? s.taskId);

  function handleSpin() {
    if (!wheel) return;
    if (spinState !== "idle" || eligible.length === 0) return;

    const task = spinWheel(wheel.id, dueTasks);
    if (!task) return;

    const n = eligible.length;
    const targetIndex = eligible.findIndex((t) => t.id === task.id);
    const sliceAngle = 360 / n;
    const landAngle =
      (((360 - (targetIndex + 0.5) * sliceAngle) % 360) + 360) % 360;
    const newRotation = rotation + 5 * 360 + landAngle;

    setRotation(newRotation);
    setSpinState("spinning");
    setSelectedTask(task);

    setTimeout(() => setSpinState("result"), SPIN_DURATION + 120);
  }

  function handleComplete() {
    if (!selectedTask) return;
    if (!wheel) return;

    completeWheelTask(wheel.id, selectedTask.id, dueTasks).then(() => {
      setSelectedTask(null);
      setSpinState("idle");
      // Show modal if wheel just became complete
      const updated = useWheelStore.getState().wheels.find((w) => w.id === id);
      if (updated?.status === "completed") setShowCompleteModal(true);
    });
  }

  function handleSkip() {
    setSelectedTask(null);
    setSpinState("idle");
  }

  const selectedCategory = selectedTask?.categoryId
    ? categories.find((c) => c.id === selectedTask.categoryId)
    : undefined;

  const canSpin =
    spinState === "idle" && eligible.length > 0 && wheel.status === "active";

  return (
    <div className="mesh-bg min-h-screen">
      <header className="bg-white/50 backdrop-blur-lg border-b border-white/60 shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/wheels")}
          className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
        >
          ← Wheels
        </button>
        <div className="flex-1 min-w-0">
          <span className="font-display font-bold text-xl text-ink tracking-tight truncate block">
            {wheel.name}
          </span>
        </div>
        {wheel.mode === "sequential" && (
          <span className="text-xs font-semibold text-ink/40 shrink-0">
            {completedCount}/{eligible.length + completedCount} done
          </span>
        )}
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-8">
        {eligible.length === 0 && wheel.status === "active" ? (
          <div className="card-glass rounded-2xl p-6 w-full text-center">
            <p className="text-ink/50 text-sm">
              No tasks due right now in this wheel's categories.
            </p>
          </div>
        ) : (
          <ChoreWheel
            tasks={eligible}
            categoryColors={categoryColors}
            rotation={rotation}
            isSpinning={spinState === "spinning"}
            onSpinComplete={() => {}}
          />
        )}

        <button
          onClick={handleSpin}
          disabled={!canSpin}
          className="rounded-full bg-coral text-white px-12 py-4 text-lg font-display font-bold btn-action shadow-xl disabled:opacity-40"
          style={{ letterSpacing: "0.02em" }}
        >
          {spinState === "spinning" ? "Spinning…" : "SPIN"}
        </button>

        {wheel.mode === "sequential" && eligible.length > 0 && (
          <p className="text-xs text-ink/35 text-center">
            {eligible.length} task{eligible.length !== 1 ? "s" : ""} left this
            round
          </p>
        )}
      </main>

      {spinState === "result" && selectedTask && (
        <SpinResult
          task={selectedTask}
          category={selectedCategory}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      )}

      {showCompleteModal && (
        <WheelCompleteModal
          wheel={wheel}
          taskTitles={completedTaskTitles}
          onRestart={() => {
            restartWheel(wheel.id);
            setShowCompleteModal(false);
          }}
          onDismiss={() => setShowCompleteModal(false)}
        />
      )}
    </div>
  );
}
