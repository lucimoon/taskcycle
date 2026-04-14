import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { CategoryStat } from '@/utils/analyticsUtils'

interface CategoryPieChartProps {
  stats: CategoryStat[]
}

export function CategoryPieChart({ stats }: CategoryPieChartProps) {
  if (stats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-ink/40 font-body text-sm">
        No data yet
      </div>
    )
  }

  const data = stats.map((s) => ({
    name: s.category.name,
    value: s.total,
    color: s.category.color,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
          labelLine={false}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="#0f172a" strokeWidth={1.5} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => { const n = typeof value === 'number' ? value : 0; return [`${n} task${n !== 1 ? 's' : ''}`, 'Total'] }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
