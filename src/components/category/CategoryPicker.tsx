import { useEffect } from 'react'
import { useCategoryStore } from '@/store/categoryStore'

const inputCls = 'glass-input'

interface CategoryPickerProps {
  value: string | undefined
  onChange: (categoryId: string | undefined) => void
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const { categories, loadCategories } = useCategoryStore()

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  if (categories.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      {value && (
        <span
          className="w-4 h-4 rounded-full shrink-0"
          style={{ backgroundColor: categories.find((c) => c.id === value)?.color }}
        />
      )}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={inputCls}
      >
        <option value="">None</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  )
}
