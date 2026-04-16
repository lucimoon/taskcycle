import type { SortKey } from "@/hooks/useSortedTasks";
import { useSettingsStore } from "../../store/settingsStore";
import { Settings } from "../../types/settings";

function getSortOptions(settings: Settings) {
  let options = [
    { key: "due", label: "Due date" },
    { key: "time", label: "Time to complete" },
  ];

  if (settings.matrixMenuEnabled) {
    options = options.concat([
      { key: "priority", label: "Priority" },
      { key: "urgency", label: "Urgency" },
    ]);
  }

  return options;
}

interface SortControlsProps {
  sort: SortKey;
  onChange: (sort: SortKey) => void;
}

export function SortControls({ sort, onChange }: SortControlsProps) {
  const { settings } = useSettingsStore();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-xs font-semibold text-ink/50 shrink-0"
      >
        Sort
      </label>
      <select
        id="sort-select"
        value={sort}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="glass-input"
      >
        {getSortOptions(settings).map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
