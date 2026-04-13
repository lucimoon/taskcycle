import type { Category } from '@/types/category'

interface CategoryBadgeProps {
  category: Category
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className="rounded-lg border-2 border-ink px-2 py-0.5 text-xs font-bold text-white"
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </span>
  )
}
