import type { SortKey } from "@/hooks/useSortedTasks";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "urgency", label: "Urgency" },
  { key: "time", label: "⚡ Quick wins" },
  { key: "due", label: "Due date" },
  { key: "completion", label: "Completion" },
];

interface SortControlsProps {
  sort: SortKey;
  onChange: (sort: SortKey) => void;
}

export function SortControls({ sort, onChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-ink/50 shrink-0">
        Sort
      </label>
      <select
        id="sort-select"
        value={sort}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="glass-input"
      >
        {SORT_OPTIONS.map(({ key, label }) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  );
}
