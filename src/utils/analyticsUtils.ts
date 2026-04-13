import type { Task } from '@/types/task'
import type { Category } from '@/types/category'

export interface CategoryStat {
  category: Category
  total: number
  completed: number
  completionRate: number
}

export interface PeriodStat {
  label: string
  completions: Record<string, number>
}

const UNCATEGORIZED: Category = {
  id: '__none__',
  name: 'Uncategorized',
  color: '#6b7280',
  createdAt: '',
}

export function getCategoryCompletionStats(tasks: Task[], categories: Category[]): CategoryStat[] {
  const all = [...categories, UNCATEGORIZED]
  return all
    .map((cat) => {
      const bucket = cat.id === '__none__'
        ? tasks.filter((t) => !t.categoryId)
        : tasks.filter((t) => t.categoryId === cat.id)
      const total = bucket.length
      const completed = bucket.filter((t) => t.completedAt).length
      return { category: cat, total, completed, completionRate: total > 0 ? completed / total : 0 }
    })
    .filter((s) => s.total > 0)
}

export function getCompletionsByPeriod(
  tasks: Task[],
  categories: Category[],
  period: 'week' | 'month',
): PeriodStat[] {
  const completed = tasks.filter((t) => t.completedAt)
  const now = new Date()
  const allCategoryIds = [...categories.map((c) => c.id), '__none__']

  if (period === 'week') {
    // Last 7 calendar days, one bucket per day
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      d.setHours(0, 0, 0, 0)
      const next = new Date(d)
      next.setDate(next.getDate() + 1)

      const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      const completions: Record<string, number> = {}
      for (const id of allCategoryIds) {
        completions[id] = 0
      }
      for (const t of completed) {
        const completedAt = new Date(t.completedAt!)
        if (completedAt >= d && completedAt < next) {
          const key = t.categoryId ?? '__none__'
          completions[key] = (completions[key] ?? 0) + 1
        }
      }
      return { label, completions }
    })
  }

  // Month: last 30 days in ~weekly buckets (4 buckets of 7–8 days)
  const buckets = [
    { label: '', start: 22, end: 30 },
    { label: '', start: 15, end: 22 },
    { label: '', start: 8, end: 15 },
    { label: '', start: 0, end: 8 },
  ].map(({ start, end }) => {
    const bucketStart = new Date(now)
    bucketStart.setDate(bucketStart.getDate() - end)
    bucketStart.setHours(0, 0, 0, 0)
    const bucketEnd = new Date(now)
    bucketEnd.setDate(bucketEnd.getDate() - start)
    bucketEnd.setHours(23, 59, 59, 999)
    return { bucketStart, bucketEnd }
  }).reverse()

  return buckets.map(({ bucketStart, bucketEnd }) => {
    const label = bucketStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    const completions: Record<string, number> = {}
    for (const id of allCategoryIds) {
      completions[id] = 0
    }
    for (const t of completed) {
      const completedAt = new Date(t.completedAt!)
      if (completedAt >= bucketStart && completedAt <= bucketEnd) {
        const key = t.categoryId ?? '__none__'
        completions[key] = (completions[key] ?? 0) + 1
      }
    }
    return { label, completions }
  })
}
