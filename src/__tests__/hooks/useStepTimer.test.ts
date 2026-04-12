import { renderHook, act } from '@testing-library/react'
import { useStepTimer } from '@/hooks/useStepTimer'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useStepTimer', () => {
  it('starts with full duration', () => {
    const { result } = renderHook(() => useStepTimer(2))
    expect(result.current.remainingMs).toBe(120_000)
    expect(result.current.running).toBe(false)
  })

  it('counts down when running', () => {
    const { result } = renderHook(() => useStepTimer(1))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.remainingMs).toBe(57_000)
  })

  it('does not count down when paused', () => {
    const { result } = renderHook(() => useStepTimer(1))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.pause())
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.remainingMs).toBe(58_000)
    expect(result.current.running).toBe(false)
  })

  it('resets to full duration', () => {
    const { result } = renderHook(() => useStepTimer(1))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(10_000))
    act(() => result.current.reset())
    expect(result.current.remainingMs).toBe(60_000)
    expect(result.current.running).toBe(false)
  })

  it('calls onComplete and stops when reaching zero', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useStepTimer(1, onComplete))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(60_000))
    expect(result.current.remainingMs).toBe(0)
    expect(result.current.running).toBe(false)
    expect(onComplete).toHaveBeenCalledOnce()
  })
})
