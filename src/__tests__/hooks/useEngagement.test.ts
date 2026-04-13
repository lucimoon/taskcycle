import { vi, describe, it, expect, beforeEach } from 'vitest'
import { triggerStepComplete, triggerTaskComplete } from '@/services/audio/engagementService'
import * as audioService from '@/services/audio/audioService'
import * as confettiEffect from '@/components/feedback/ConfettiEffect'
import { useSettingsStore } from '@/store/settingsStore'
import { DEFAULT_SETTINGS } from '@/types/settings'

vi.mock('@/services/audio/audioService', () => ({
  playStepComplete: vi.fn(),
  playTaskComplete: vi.fn(),
}))

vi.mock('@/components/feedback/ConfettiEffect', () => ({
  fireConfetti: vi.fn(),
}))

function setSettings(overrides: object) {
  useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS, ...overrides } })
}

beforeEach(() => {
  vi.clearAllMocks()
  setSettings({})
})

describe('triggerStepComplete', () => {
  it('plays audio when audioEnabled', () => {
    setSettings({ audioEnabled: true })
    triggerStepComplete()
    expect(audioService.playStepComplete).toHaveBeenCalledOnce()
  })

  it('does not play audio when audioEnabled is false', () => {
    setSettings({ audioEnabled: false })
    triggerStepComplete()
    expect(audioService.playStepComplete).not.toHaveBeenCalled()
  })
})

describe('triggerTaskComplete', () => {
  it('plays audio and fires confetti when both enabled', () => {
    setSettings({ audioEnabled: true, animationsEnabled: true })
    triggerTaskComplete()
    expect(audioService.playTaskComplete).toHaveBeenCalledOnce()
    expect(confettiEffect.fireConfetti).toHaveBeenCalledOnce()
  })

  it('skips audio when audioEnabled is false', () => {
    setSettings({ audioEnabled: false, animationsEnabled: true })
    triggerTaskComplete()
    expect(audioService.playTaskComplete).not.toHaveBeenCalled()
    expect(confettiEffect.fireConfetti).toHaveBeenCalledOnce()
  })

  it('skips confetti when animationsEnabled is false', () => {
    setSettings({ audioEnabled: true, animationsEnabled: false })
    triggerTaskComplete()
    expect(audioService.playTaskComplete).toHaveBeenCalledOnce()
    expect(confettiEffect.fireConfetti).not.toHaveBeenCalled()
  })
})
