import type { SortKey } from "@/hooks/useSortedTasks";

const SORT_OPTIONS: { key: SortKey; label: string; title: string }[] = [
  // { key: "default", label: "Added", title: "Sort by date added" },
  {
    key: "priority",
    label: "Priority",
    title: "Sort by priority (highest first)",
  },
  {
    key: "urgency",
    label: "Urgency",
    title: "Sort by urgency (most urgent first)",
  },
  {
    key: "time",
    label: "⚡ Quick wins",
    title: "Sort by estimated time (shortest first)",
  },
  { key: "due", label: "Due date", title: "Sort by due date (soonest first)" },
  {
    key: "completion",
    label: "Completion",
    title: "Sort by completion (incomplete first)",
  },
];

interface SortControlsProps {
  sort: SortKey;
  onChange: (sort: SortKey) => void;
}

export function SortControls({ sort, onChange }: SortControlsProps) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Sort tasks">
      {SORT_OPTIONS.map(({ key, label, title }) => (
        <button
          key={key}
          type="button"
          title={title}
          aria-pressed={sort === key}
          onClick={() => onChange(key)}
          className={[
            "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
            sort === key
              ? "bg-coral text-white shadow-md"
              : "bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-white/80",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
