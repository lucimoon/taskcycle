import type { Step } from '@/types/task'

export function useFocusAutoAdvance() {
  function advance(steps: Step[]) {
    const next = steps.find((s) => !s.completedAt)
    if (!next) return
    const el = document.getElementById(`focus-step-${next.id}`)
    el?.focus()
    el?.closest('li')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return { advance }
}
