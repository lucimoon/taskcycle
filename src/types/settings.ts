export interface Settings {
  audioEnabled: boolean;
  animationsEnabled: boolean;
  analyticsMenuEnabled: boolean;
  rewardsMenuEnabled: boolean;
  matrixMenuEnabled: boolean;
  categoriesMenuEnabled: boolean;
  notificationsEnabled: boolean;
  syncDirectoryHandle?: FileSystemDirectoryHandle;
  focusedTaskId?: string | null;
  goalsEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  audioEnabled: true,
  animationsEnabled: true,
  notificationsEnabled: false,
  analyticsMenuEnabled: false,
  rewardsMenuEnabled: false,
  categoriesMenuEnabled: false,
  matrixMenuEnabled: false,
  focusedTaskId: null,
  goalsEnabled: false,
};
