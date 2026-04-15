import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWheelStore } from '@/store/wheelStore'
import { useCategoryStore } from '@/store/categoryStore'
import type { WheelMode } from '@/types/wheel'

export function WheelSetupView() {
  const navigate = useNavigate()
  const { createWheel } = useWheelStore()
  const { categories, loadCategories } = useCategoryStore()

  const [name, setName] = useState('')
  const [mode, setMode] = useState<WheelMode>('sequential')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await createWheel({ name: name.trim(), mode, categoryIds: selectedCategoryIds })
    navigate('/wheels')
  }

  return (
    <div className="mesh-bg min-h-screen">
      <header className="bg-white/50 backdrop-blur-lg border-b border-white/60 shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/wheels')}
          className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
        >
          ← Back
        </button>
        <span className="font-display font-bold text-xl text-ink tracking-tight">New Wheel</span>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-6 space-y-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-ink">Wheel name</label>
            <input
              className="glass-input"
              placeholder="e.g. Weekly Chores"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {(['sequential', 'free'] as WheelMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all btn-action border ${
                    mode === m
                      ? 'bg-coral text-white border-coral shadow-md'
                      : 'bg-white/60 border-white/80 text-ink hover:bg-white/80'
                  }`}
                >
                  <div className="font-bold capitalize">{m}</div>
                  <div className={`text-xs mt-0.5 ${mode === m ? 'text-white/80' : 'text-ink/50'}`}>
                    {m === 'sequential'
                      ? 'Each task appears once per round'
                      : 'Any due task can appear any spin'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">
                Categories
                <span className="text-ink/40 font-normal ml-1.5">(leave empty for all)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const selected = selectedCategoryIds.includes(cat.id)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all btn-action border ${
                        selected
                          ? 'text-white border-transparent shadow-md'
                          : 'bg-white/60 border-white/80 text-ink hover:bg-white/80'
                      }`}
                      style={selected ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="w-full rounded-full bg-coral text-white py-3 font-semibold btn-action shadow-md disabled:opacity-40"
          >
            {saving ? 'Creating…' : 'Create Wheel'}
          </button>
        </form>
      </main>
    </div>
  )
}
