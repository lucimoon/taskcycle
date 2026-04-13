import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock the Notification API before importing the service
const mockNotification = vi.fn()
Object.defineProperty(global, 'Notification', {
  writable: true,
  value: Object.assign(mockNotification, { permission: 'granted' as NotificationPermission }),
})

import {
  scheduleNotification,
  cancelNotification,
  cancelAll,
  getPermissionState,
} from '@/services/notifications/notificationService'

beforeEach(() => {
  vi.useFakeTimers()
  cancelAll()
  mockNotification.mockClear()
  ;(Notification as unknown as { permission: string }).permission = 'granted'
})

afterEach(() => {
  vi.useRealTimers()
})

describe('scheduleNotification', () => {
  it('fires a Notification at the specified time', () => {
    const fireAt = new Date(Date.now() + 5000)
    scheduleNotification('task-1', 'Due in 15 min', 'Buy milk', fireAt)
    expect(mockNotification).not.toHaveBeenCalled()

    vi.advanceTimersByTime(5000)
    expect(mockNotification).toHaveBeenCalledWith('Due in 15 min', { body: 'Buy milk', tag: 'task-1' })
  })

  it('does not fire when permission is denied', () => {
    ;(Notification as unknown as { permission: string }).permission = 'denied'
    const fireAt = new Date(Date.now() + 1000)
    scheduleNotification('task-2', 'Due now', 'Test task', fireAt)
    vi.advanceTimersByTime(2000)
    expect(mockNotification).not.toHaveBeenCalled()
  })

  it('cancels a previous schedule for the same taskId before adding a new one', () => {
    const fireAt1 = new Date(Date.now() + 10000)
    const fireAt2 = new Date(Date.now() + 3000)
    scheduleNotification('task-3', 'First', 'body', fireAt1)
    scheduleNotification('task-3', 'Second', 'body', fireAt2)

    vi.advanceTimersByTime(10000)
    expect(mockNotification).toHaveBeenCalledTimes(1)
    expect(mockNotification).toHaveBeenCalledWith('Second', expect.any(Object))
  })

  it('does not schedule a notification with a past fireAt', () => {
    const fireAt = new Date(Date.now() - 1000)
    scheduleNotification('task-past', 'Old', 'body', fireAt)
    vi.advanceTimersByTime(5000)
    expect(mockNotification).not.toHaveBeenCalled()
  })
})

describe('cancelNotification', () => {
  it('prevents a scheduled notification from firing', () => {
    const fireAt = new Date(Date.now() + 3000)
    scheduleNotification('task-4', 'Due', 'body', fireAt)
    cancelNotification('task-4')
    vi.advanceTimersByTime(5000)
    expect(mockNotification).not.toHaveBeenCalled()
  })
})

describe('cancelAll', () => {
  it('cancels all scheduled notifications', () => {
    scheduleNotification('a', 'A', 'body', new Date(Date.now() + 1000))
    scheduleNotification('b', 'B', 'body', new Date(Date.now() + 2000))
    cancelAll()
    vi.advanceTimersByTime(5000)
    expect(mockNotification).not.toHaveBeenCalled()
  })
})

describe('getPermissionState', () => {
  it('returns granted when permission is granted', () => {
    ;(Notification as unknown as { permission: string }).permission = 'granted'
    expect(getPermissionState()).toBe('granted')
  })

  it('returns denied when permission is denied', () => {
    ;(Notification as unknown as { permission: string }).permission = 'denied'
    expect(getPermissionState()).toBe('denied')
  })
})
