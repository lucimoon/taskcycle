import type { Category } from '@/types/category'

interface CategoryBadgeProps {
  category: Category
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className="rounded-full px-3 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </span>
  )
}
