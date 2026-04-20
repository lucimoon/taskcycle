import { describe, it, expect } from 'vitest'
import { getQuadrant, quadrantToPriorityUrgency, QUADRANTS } from '@/utils/matrixUtils'

describe('getQuadrant', () => {
  it('maps high priority + high urgency to do-first', () => {
    expect(getQuadrant(1, 1)).toBe('do-first')
    expect(getQuadrant(1, 2)).toBe('do-first')
    expect(getQuadrant(2, 1)).toBe('do-first')
    expect(getQuadrant(2, 2)).toBe('do-first')
  })

  it('maps high priority + low urgency to schedule', () => {
    expect(getQuadrant(1, 3)).toBe('schedule')
    expect(getQuadrant(1, 4)).toBe('schedule')
    expect(getQuadrant(2, 3)).toBe('schedule')
    expect(getQuadrant(2, 4)).toBe('schedule')
  })

  it('maps low priority + high urgency to delegate', () => {
    expect(getQuadrant(3, 1)).toBe('delegate')
    expect(getQuadrant(3, 2)).toBe('delegate')
    expect(getQuadrant(4, 1)).toBe('delegate')
    expect(getQuadrant(4, 2)).toBe('delegate')
  })

  it('maps low priority + low urgency to eliminate', () => {
    expect(getQuadrant(3, 3)).toBe('eliminate')
    expect(getQuadrant(3, 4)).toBe('eliminate')
    expect(getQuadrant(4, 3)).toBe('eliminate')
    expect(getQuadrant(4, 4)).toBe('eliminate')
  })
})

describe('quadrantToPriorityUrgency', () => {
  it('maps do-first to priority 1, urgency 1', () => {
    expect(quadrantToPriorityUrgency('do-first')).toEqual({ priority: 1, urgency: 1 })
  })

  it('maps schedule to priority 1, urgency 3', () => {
    expect(quadrantToPriorityUrgency('schedule')).toEqual({ priority: 1, urgency: 3 })
  })

  it('maps delegate to priority 3, urgency 1', () => {
    expect(quadrantToPriorityUrgency('delegate')).toEqual({ priority: 3, urgency: 1 })
  })

  it('maps eliminate to priority 3, urgency 3', () => {
    expect(quadrantToPriorityUrgency('eliminate')).toEqual({ priority: 3, urgency: 3 })
  })

  it('is the inverse of getQuadrant for all quadrants', () => {
    for (const q of QUADRANTS) {
      const { priority, urgency } = quadrantToPriorityUrgency(q.key)
      expect(getQuadrant(priority, urgency)).toBe(q.key)
    }
  })
})
