import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";
import { useCategoryStore } from "@/store/categoryStore";
import {
  getCategoryCompletionStats,
  getCompletionsByPeriod,
} from "@/utils/analyticsUtils";
import { CategoryPieChart } from "@/components/analytics/CategoryPieChart";
import { CategoryBarChart } from "@/components/analytics/CategoryBarChart";

type ChartType = "distribution" | "overtime";
type Period = "week" | "month";

export function CategoryAnalyticsView() {
  const { tasks, loadTasks } = useTaskStore();
  const { categories, loadCategories } = useCategoryStore();
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<ChartType>("distribution");
  const [period, setPeriod] = useState<Period>("week");

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [loadTasks, loadCategories]);

  const stats = getCategoryCompletionStats(tasks, categories);
  const periodStats = getCompletionsByPeriod(tasks, categories, period);

  return (
    <div className="mesh-bg min-h-screen">
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center space-y-3">
            <p className="text-ink/50">No categories yet.</p>
            <button
              onClick={() => navigate("/taskcycle/categories")}
              className="rounded-full bg-coral text-white px-5 py-2.5 text-sm font-semibold btn-action shadow-md"
            >
              Set up categories
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-white/50 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/80">
                <button
                  onClick={() => setChartType("distribution")}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                    chartType === "distribution"
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-white/40"
                  }`}
                >
                  Distribution
                </button>
                <button
                  onClick={() => setChartType("overtime")}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                    chartType === "overtime"
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-white/40"
                  }`}
                >
                  Over time
                </button>
              </div>

              {chartType === "overtime" && (
                <div className="bg-white/50 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/80">
                  <button
                    onClick={() => setPeriod("week")}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                      period === "week"
                        ? "bg-ink text-white"
                        : "text-ink hover:bg-white/40"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setPeriod("month")}
                    className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                      period === "month"
                        ? "bg-ink text-white"
                        : "text-ink hover:bg-white/40"
                    }`}
                  >
                    Month
                  </button>
                </div>
              )}
            </div>

            <div className="card-glass rounded-2xl p-4 min-h-48">
              {chartType === "distribution" ? (
                <CategoryPieChart stats={stats} />
              ) : (
                <CategoryBarChart stats={periodStats} categories={categories} />
              )}
            </div>

            <div className="space-y-2">
              {stats.map((s) => (
                <div
                  key={s.category.id}
                  className="card-glass rounded-2xl px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.category.color }}
                  />
                  <span className="font-bold text-sm text-ink flex-1">
                    {s.category.name}
                  </span>
                  <span className="text-xs text-ink/60">
                    {s.completed}/{s.total} done
                  </span>
                  <span className="text-xs font-bold text-ink/80">
                    {Math.round(s.completionRate * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
