import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWheelStore } from "@/store/wheelStore";
import { useCategoryStore } from "@/store/categoryStore";
import type { Wheel } from "@/types/wheel";

function WheelCard({
  wheel,
  onSpin,
  onRestart,
  onDelete,
  categoryColors,
}: {
  wheel: Wheel;
  onSpin: () => void;
  onRestart: () => void;
  onDelete: () => void;
  categoryColors: Record<string, { name: string; color: string }>;
}) {
  const completedCount = wheel.slots.filter((s) => s.completedAt).length;

  return (
    <div className="card-glass rounded-2xl p-5 space-y-3 animate-[pop-in_200ms_cubic-bezier(0.34,1.56,0.64,1)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-display font-bold text-lg text-ink leading-tight">
            {wheel.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                wheel.mode === "sequential"
                  ? "bg-lavender/20 text-lavender"
                  : "bg-sky/20 text-sky"
              }`}
            >
              {wheel.mode}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                wheel.status === "completed"
                  ? "bg-mint/20 text-mint"
                  : "bg-amber/20 text-amber"
              }`}
            >
              {wheel.status}
            </span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-ink/30 hover:text-coral transition-colors text-lg leading-none mt-0.5 btn-action"
          aria-label="Delete wheel"
        >
          ×
        </button>
      </div>

      {/* Category tags */}
      {wheel.categoryIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {wheel.categoryIds.map((id) => {
            const cat = categoryColors[id];
            if (!cat) return null;
            return (
              <span
                key={id}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Progress (sequential mode) */}
      {wheel.mode === "sequential" && wheel.slots.length > 0 && (
        <div className="text-xs text-ink/50">
          {completedCount} / {wheel.slots.length} done this round
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {wheel.status === "active" ? (
          <button
            onClick={onSpin}
            className="flex-1 rounded-full bg-coral text-white py-2 text-sm font-semibold btn-action shadow-md"
          >
            Spin
          </button>
        ) : (
          <button
            onClick={onRestart}
            className="flex-1 rounded-full bg-mint text-white py-2 text-sm font-semibold btn-action shadow-md"
          >
            Restart
          </button>
        )}
      </div>
    </div>
  );
}

export function WheelListView() {
  const navigate = useNavigate();
  const { wheels, loadWheels, deleteWheel, restartWheel } = useWheelStore();
  const { categories, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadWheels();
    loadCategories();
  }, [loadWheels, loadCategories]);

  const categoryColors = Object.fromEntries(
    categories.map((c) => [c.id, { name: c.name, color: c.color }]),
  );

  function handleDelete(id: string) {
    if (window.confirm("Delete this wheel?")) deleteWheel(id);
  }

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-ink tracking-tight">
          Wheels
        </h1>
        <button
          onClick={() => navigate("/taskcycle/wheels/new")}
          className="rounded-full bg-coral text-white px-5 py-2 text-sm font-semibold btn-action shadow-md"
        >
          + New Wheel
        </button>
      </div>

      <main className="max-w-lg mx-auto px-4 py-2 space-y-4">
        {wheels.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">🎡</div>
            <p className="text-ink/50 text-sm">
              No wheels yet. Create one to get spinning!
            </p>
          </div>
        ) : (
          wheels.map((wheel) => (
            <WheelCard
              key={wheel.id}
              wheel={wheel}
              categoryColors={categoryColors}
              onSpin={() => navigate(`/taskcycle/wheels/${wheel.id}`)}
              onRestart={() => restartWheel(wheel.id)}
              onDelete={() => handleDelete(wheel.id)}
            />
          ))
        )}
      </main>
    </div>
  );
}
