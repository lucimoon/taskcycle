export interface Settings {
  audioEnabled: boolean
  animationsEnabled: boolean
  notificationsEnabled: boolean
  syncDirectoryHandle?: FileSystemDirectoryHandle
}

export const DEFAULT_SETTINGS: Settings = {
  audioEnabled: true,
  animationsEnabled: true,
  notificationsEnabled: false,
}
