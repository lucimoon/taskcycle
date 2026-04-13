import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@/store/taskStore'
import { useCategoryStore } from '@/store/categoryStore'
import { getCategoryCompletionStats, getCompletionsByPeriod } from '@/utils/analyticsUtils'
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart'
import { CategoryBarChart } from '@/components/analytics/CategoryBarChart'

type ChartType = 'distribution' | 'overtime'
type Period = 'week' | 'month'

export function CategoryAnalyticsView() {
  const { tasks, loadTasks } = useTaskStore()
  const { categories, loadCategories } = useCategoryStore()
  const navigate = useNavigate()
  const [chartType, setChartType] = useState<ChartType>('distribution')
  const [period, setPeriod] = useState<Period>('week')

  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [loadTasks, loadCategories])

  const stats = getCategoryCompletionStats(tasks, categories)
  const periodStats = getCompletionsByPeriod(tasks, categories, period)

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream border-b-2 border-ink px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-bold text-ink/60 hover:text-ink transition-colors"
        >
          ← Tasks
        </button>
        <span className="font-display font-bold text-xl text-ink">Analytics</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {categories.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/30 p-10 text-center space-y-3">
            <p className="text-ink/50 font-body">No categories yet.</p>
            <button
              onClick={() => navigate('/categories')}
              className="rounded-xl bg-coral border-2 border-ink px-4 py-2 text-sm font-bold text-white btn-lift"
            >
              Set up categories
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex rounded-xl border-2 border-ink overflow-hidden">
                <button
                  onClick={() => setChartType('distribution')}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${
                    chartType === 'distribution' ? 'bg-ink text-cream' : 'bg-surface text-ink hover:bg-ink/8'
                  }`}
                >
                  Distribution
                </button>
                <button
                  onClick={() => setChartType('overtime')}
                  className={`px-4 py-2 text-sm font-bold transition-colors border-l-2 border-ink ${
                    chartType === 'overtime' ? 'bg-ink text-cream' : 'bg-surface text-ink hover:bg-ink/8'
                  }`}
                >
                  Over time
                </button>
              </div>

              {chartType === 'overtime' && (
                <div className="flex rounded-xl border-2 border-ink overflow-hidden">
                  <button
                    onClick={() => setPeriod('week')}
                    className={`px-4 py-2 text-sm font-bold transition-colors ${
                      period === 'week' ? 'bg-ink text-cream' : 'bg-surface text-ink hover:bg-ink/8'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setPeriod('month')}
                    className={`px-4 py-2 text-sm font-bold transition-colors border-l-2 border-ink ${
                      period === 'month' ? 'bg-ink text-cream' : 'bg-surface text-ink hover:bg-ink/8'
                    }`}
                  >
                    Month
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border-2 border-ink bg-surface shadow-hard p-4">
              {chartType === 'distribution' ? (
                <CategoryPieChart stats={stats} />
              ) : (
                <CategoryBarChart stats={periodStats} categories={categories} />
              )}
            </div>

            <div className="space-y-2">
              {stats.map((s) => (
                <div
                  key={s.category.id}
                  className="rounded-2xl border-2 border-ink bg-surface shadow-hard px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className="w-3 h-3 rounded-full border-2 border-ink shrink-0"
                    style={{ backgroundColor: s.category.color }}
                  />
                  <span className="font-bold text-sm text-ink flex-1">{s.category.name}</span>
                  <span className="text-xs font-body text-ink/60">
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
  )
}
