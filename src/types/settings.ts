export interface Settings {
  audioEnabled: boolean;
  animationsEnabled: boolean;
  analyticsMenuEnabled: boolean;
  rewardsMenuEnabled: boolean;
  categoriesMenuEnabled: boolean;
  notificationsEnabled: boolean;
  syncDirectoryHandle?: FileSystemDirectoryHandle;
}

export const DEFAULT_SETTINGS: Settings = {
  audioEnabled: true,
  animationsEnabled: true,
  notificationsEnabled: false,
  analyticsMenuEnabled: false,
  rewardsMenuEnabled: true,
  categoriesMenuEnabled: false,
};
