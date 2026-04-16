import { create } from "zustand";
import { DEFAULT_SETTINGS, type Settings } from "@/types/settings";
import * as settingsService from "@/services/settings/settingsService";

interface SettingsStore {
  settings: Settings;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: async () => {
    const settings = await settingsService.getSettings();
    // Re-request permission for a saved directory handle each session
    if (settings.syncDirectoryHandle) {
      try {
        const handle =
          settings.syncDirectoryHandle as FileSystemDirectoryHandle & {
            requestPermission: (opts: { mode: string }) => Promise<string>;
          };
        const state = await handle.requestPermission({ mode: "readwrite" });
        if (state !== "granted") {
          settings.syncDirectoryHandle = undefined;
        }
      } catch {
        settings.syncDirectoryHandle = undefined;
      }
    }
    set({ settings });
  },

  updateSettings: async (partial) => {
    const next = { ...get().settings, ...partial };
    set({ settings: next });
    await settingsService.saveSettings(next);
  },
}));
