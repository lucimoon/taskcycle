import { useSettingsStore } from '@/store/settingsStore'
import { playStepComplete, playTaskComplete } from './audioService'
import { fireConfetti } from '@/components/feedback/ConfettiEffect'

/**
 * Called from taskStore.completeStep (audio only — the visual flash is
 * handled locally in StepChecklist since it needs to know which row to flash).
 */
export function triggerStepComplete(): void {
  const { audioEnabled } = useSettingsStore.getState().settings
  if (audioEnabled) playStepComplete()
}

/**
 * Called from taskStore.completeTask.
 */
export function triggerTaskComplete(): void {
  const { audioEnabled, animationsEnabled } = useSettingsStore.getState().settings
  if (audioEnabled) playTaskComplete()
  if (animationsEnabled) fireConfetti()
}
