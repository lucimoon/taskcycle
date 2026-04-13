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
    headerClass: 'bg-red-700 text-white',
    bgClass: 'bg-red-50',
    emptyTextClass: 'text-red-300',
    emptyBorderClass: 'border-red-200',
  },
  {
    key: 'schedule',
    label: 'Schedule',
    description: 'Important, not urgent',
    headerClass: 'bg-blue-700 text-white',
    bgClass: 'bg-blue-50',
    emptyTextClass: 'text-blue-300',
    emptyBorderClass: 'border-blue-200',
  },
  {
    key: 'delegate',
    label: 'Delegate',
    description: 'Urgent, not important',
    headerClass: 'bg-amber-700 text-white',
    bgClass: 'bg-amber-50',
    emptyTextClass: 'text-amber-300',
    emptyBorderClass: 'border-amber-200',
  },
  {
    key: 'eliminate',
    label: 'Eliminate',
    description: 'Not important, not urgent',
    headerClass: 'bg-gray-500 text-white',
    bgClass: 'bg-gray-50',
    emptyTextClass: 'text-gray-300',
    emptyBorderClass: 'border-gray-200',
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
