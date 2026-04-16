import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

interface CategoryPickerProps {
  value: string[];
  onChange: (categoryIds: string[]) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const { categories, loadCategories, addCategory } = useCategoryStore();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((x) => x !== id) : [...value, id],
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const cat = await addCategory({ name: newName.trim(), color: newColor });
    onChange([...value, cat.id]);
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
    setCreating(false);
  }

  const selectedCats = categories.filter((c) => value.includes(c.id));
  const unselectedCats = categories.filter((c) => !value.includes(c.id));

  return (
    <div className="space-y-2">
      {/* Selected chips — click to remove */}
      {selectedCats.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCats.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className="rounded-full px-3 py-1 text-xs font-semibold text-white flex items-center gap-1 transition-opacity hover:opacity-80"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name} <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      {/* Unselected categories — click to add */}
      {unselectedCats.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unselectedCats.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className="rounded-full px-3 py-1 text-xs font-semibold border bg-white/60 border-white/80 text-ink hover:bg-white/80 transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Inline create */}
      {creating ? (
        <form onSubmit={handleCreate} className="space-y-2 pt-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="glass-input"
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  newColor === c
                    ? "scale-125 ring-2 ring-ink/40"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!newName.trim()}
              onClick={handleCreate}
              className="rounded-full bg-coral text-white px-4 py-1.5 text-xs font-semibold btn-action disabled:opacity-40"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setNewName("");
              }}
              className="rounded-full bg-white/60 border border-white/80 text-ink px-4 py-1.5 text-xs font-semibold btn-action"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="text-xs text-ink/50 hover:text-ink underline transition-colors"
        >
          + New category
        </button>
      )}
    </div>
  );
}
