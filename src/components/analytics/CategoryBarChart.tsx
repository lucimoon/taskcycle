import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { PeriodStat } from '@/utils/analyticsUtils'
import type { Category } from '@/types/category'

const UNCATEGORIZED_COLOR = '#6b7280'

interface CategoryBarChartProps {
  stats: PeriodStat[]
  categories: Category[]
}

export function CategoryBarChart({ stats, categories }: CategoryBarChartProps) {
  const hasAny = stats.some((s) => Object.values(s.completions).some((v) => v > 0))

  if (!hasAny) {
    return (
      <div className="flex items-center justify-center h-64 text-ink/40 font-body text-sm">
        No completions yet
      </div>
    )
  }

  const data = stats.map((s) => ({ label: s.label, ...s.completions }))
  const allBars = [
    ...categories.map((c) => ({ id: c.id, name: c.name, color: c.color })),
    { id: '__none__', name: 'Uncategorized', color: UNCATEGORIZED_COLOR },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        {allBars.map((bar) => (
          <Bar
            key={bar.id}
            dataKey={bar.id}
            name={bar.name}
            stackId="a"
            fill={bar.color}
            stroke="#0f172a"
            strokeWidth={0.5}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
