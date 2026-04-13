import { triggerStepComplete, triggerTaskComplete } from '@/services/audio/engagementService'

export function useEngagement() {
  return { triggerStepComplete, triggerTaskComplete }
}
