import { useEffect, useState } from 'react'
import { useCategoryStore } from '@/store/categoryStore'
import { CategoryBadge } from '@/components/category/CategoryBadge'
import type { CategoryDraft } from '@/types/category'

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
  '#0f172a', // ink
]

const inputCls = 'glass-input'
const labelCls = 'text-sm font-bold text-ink'

interface CategoryFormState {
  name: string
  color: string
}

function CategoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CategoryFormState
  onSave: (draft: CategoryDraft) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [color, setColor] = useState(initial?.color ?? PRESET_COLORS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className={labelCls}>Name <span className="text-coral">*</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Work, Health, Personal"
          className={inputCls}
          autoFocus
        />
      </div>
      <div className="space-y-1.5">
        <span className={labelCls}>Color</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition-transform ${
                color === c ? 'scale-125 ring-2 ring-ink/40' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white btn-action shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

type Mode = 'list' | 'create' | { edit: string }

export function CategoryManagementView() {
  const { categories, loadCategories, addCategory, updateCategory, removeCategory } = useCategoryStore()
  const [mode, setMode] = useState<Mode>('list')

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  async function handleSave(draft: CategoryDraft) {
    if (mode === 'create') {
      await addCategory(draft)
    } else if (typeof mode === 'object' && 'edit' in mode) {
      await updateCategory(mode.edit, draft)
    }
    setMode('list')
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this category? Tasks in this category will become uncategorized.')) {
      removeCategory(id)
    }
  }

  const editingCategory =
    typeof mode === 'object' && 'edit' in mode
      ? categories.find((c) => c.id === mode.edit)
      : undefined

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-ink">Categories</h1>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="rounded-full bg-sunny text-ink px-5 py-2 text-sm font-semibold btn-action shadow-md"
          >
            + New Category
          </button>
        )}
      </div>

      <main className="max-w-2xl mx-auto px-4 py-2 space-y-4">
        {(mode === 'create' || typeof mode === 'object') && (
          <div className="card-glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-ink mb-5">
              {mode === 'create' ? 'New category' : 'Edit category'}
            </h2>
            <CategoryForm
              initial={editingCategory ? { name: editingCategory.name, color: editingCategory.color } : undefined}
              onSave={handleSave}
              onCancel={() => setMode('list')}
            />
          </div>
        )}

        {categories.length === 0 && mode === 'list' && (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <p className="text-ink/50">No categories yet — add one to organize your tasks.</p>
          </div>
        )}

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card-glass rounded-2xl p-4 flex items-center justify-between gap-3"
          >
            <CategoryBadge category={cat} />
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => setMode({ edit: cat.id })}
                aria-label="Edit category"
                className="rounded-full p-1.5 text-ink/40 hover:bg-ink/8 hover:text-ink transition-colors text-sm btn-action"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                aria-label="Delete category"
                className="rounded-full p-1.5 text-ink/40 hover:bg-coral/10 hover:text-coral transition-colors text-sm btn-action"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
