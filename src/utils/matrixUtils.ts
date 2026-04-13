import type { Priority, Urgency } from '@/types/task'

export type QuadrantKey = 'do-first' | 'schedule' | 'delegate' | 'eliminate'

export interface QuadrantMeta {
  key: QuadrantKey
  label: string
  description: string
  headerClass: string
  bgClass: string
  emptyTextClass: string
  emptyBorderClass: string
}

export const QUADRANTS: QuadrantMeta[] = [
  {
    key: 'do-first',
    label: 'Do First',
    description: 'Important & urgent',
    headerClass: 'bg-coral text-white border-b-2 border-ink',
    bgClass: 'bg-[#FFF0F0]',
    emptyTextClass: 'text-coral/40',
    emptyBorderClass: 'border-coral/30',
  },
  {
    key: 'schedule',
    label: 'Schedule',
    description: 'Important, not urgent',
    headerClass: 'bg-lavender text-ink border-b-2 border-ink',
    bgClass: 'bg-[#F5F0FF]',
    emptyTextClass: 'text-lavender/60',
    emptyBorderClass: 'border-lavender/40',
  },
  {
    key: 'delegate',
    label: 'Delegate',
    description: 'Urgent, not important',
    headerClass: 'bg-sunny text-ink border-b-2 border-ink',
    bgClass: 'bg-[#FFFBE0]',
    emptyTextClass: 'text-ink/20',
    emptyBorderClass: 'border-ink/15',
  },
  {
    key: 'eliminate',
    label: 'Eliminate',
    description: 'Not important, not urgent',
    headerClass: 'bg-ink text-cream border-b-2 border-ink',
    bgClass: 'bg-[#F5F4F0]',
    emptyTextClass: 'text-ink/20',
    emptyBorderClass: 'border-ink/15',
  },
]

// Priority 1-2 = important, 3-4 = not important
// Urgency 1-2 = urgent, 3-4 = not urgent
export function getQuadrant(priority: Priority, urgency: Urgency): QuadrantKey {
  const important = priority <= 2
  const urgent = urgency <= 2

  if (important && urgent) return 'do-first'
  if (important && !urgent) return 'schedule'
  if (!important && urgent) return 'delegate'
  return 'eliminate'
}
