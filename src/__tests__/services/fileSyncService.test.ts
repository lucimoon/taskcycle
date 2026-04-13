import { vi, describe, it, expect, beforeEach } from 'vitest'
import { isSupported, exportSnapshot, importSnapshot } from '@/services/sync/fileSyncService'
import type { Task } from '@/types/task'
import type { Reward } from '@/types/reward'

const TASKS: Task[] = [
  {
    id: 't1', kind: 'once', title: 'Test task', steps: [],
    priority: 1, urgency: 1, estimatedMinutes: 30,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

const REWARDS: Reward[] = [
  {
    id: 'r1', label: 'Coffee break', linkedTaskIds: ['t1'],
    linkType: 'tasks',
  },
]

describe('isSupported', () => {
  it('returns false when showDirectoryPicker is absent', () => {
    const original = (window as never as Record<string, unknown>).showDirectoryPicker
    delete (window as never as Record<string, unknown>).showDirectoryPicker
    expect(isSupported()).toBe(false)
    if (original !== undefined) {
      (window as never as Record<string, unknown>).showDirectoryPicker = original
    }
  })
})

describe('exportSnapshot / importSnapshot', () => {
  let writtenContent = ''

  const mockWritable = {
    write: vi.fn(async (data: string) => { writtenContent = data }),
    close: vi.fn(async () => {}),
  }

  const mockFileHandle = {
    createWritable: vi.fn(async () => mockWritable),
    getFile: vi.fn(async () => ({
      text: async () => writtenContent,
    })),
  }

  const mockDirHandle = {
    getFileHandle: vi.fn(async () => mockFileHandle),
  } as unknown as FileSystemDirectoryHandle

  beforeEach(() => {
    writtenContent = ''
    vi.clearAllMocks()
  })

  it('export writes valid JSON with tasks, rewards, exportedAt', async () => {
    await exportSnapshot(mockDirHandle, TASKS, REWARDS)
    const parsed = JSON.parse(writtenContent)
    expect(parsed.tasks).toEqual(TASKS)
    expect(parsed.rewards).toEqual(REWARDS)
    expect(typeof parsed.exportedAt).toBe('string')
  })

  it('import round-trips tasks and rewards', async () => {
    await exportSnapshot(mockDirHandle, TASKS, REWARDS)
    const result = await importSnapshot(mockDirHandle)
    expect(result?.tasks).toEqual(TASKS)
    expect(result?.rewards).toEqual(REWARDS)
  })

  it('import returns null for missing file', async () => {
    (mockDirHandle as unknown as { getFileHandle: ReturnType<typeof vi.fn> })
      .getFileHandle = vi.fn(async () => { throw new Error('not found') })
    const result = await importSnapshot(mockDirHandle)
    expect(result).toBeNull()
  })
})
