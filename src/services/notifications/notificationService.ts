const scheduled = new Map<string, ReturnType<typeof setTimeout>>()

export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function getPermissionState(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export function scheduleNotification(taskId: string, title: string, body: string, fireAt: Date): void {
  cancelNotification(taskId)
  const delayMs = fireAt.getTime() - Date.now()
  if (delayMs < 0) return
  const id = setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, tag: taskId })
    }
    scheduled.delete(taskId)
  }, delayMs)
  scheduled.set(taskId, id)
}

export function cancelNotification(taskId: string): void {
  const id = scheduled.get(taskId)
  if (id != null) {
    clearTimeout(id)
    scheduled.delete(taskId)
  }
}

export function cancelAll(): void {
  for (const id of scheduled.values()) {
    clearTimeout(id)
  }
  scheduled.clear()
}
