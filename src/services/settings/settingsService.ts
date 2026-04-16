import { db } from "@/services/db/db";
import { DEFAULT_SETTINGS, type Settings } from "@/types/settings";

export async function getSettings(): Promise<Settings> {
  const rows = await db.settings.toArray();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    audioEnabled: (map.audioEnabled ??
      DEFAULT_SETTINGS.audioEnabled) as boolean,
    categoriesMenuEnabled: (map.categoriesMenuEnabled ??
      DEFAULT_SETTINGS.categoriesMenuEnabled) as boolean,
    analyticsMenuEnabled: (map.analyticsMenuEnabled ??
      DEFAULT_SETTINGS.analyticsMenuEnabled) as boolean,
    rewardsMenuEnabled: (map.rewardsMenuEnabled ??
      DEFAULT_SETTINGS.rewardsMenuEnabled) as boolean,
    matrixMenuEnabled: (map.matrixMenuEnabled ??
      DEFAULT_SETTINGS.matrixMenuEnabled) as boolean,
    animationsEnabled: (map.animationsEnabled ??
      DEFAULT_SETTINGS.animationsEnabled) as boolean,
    notificationsEnabled: (map.notificationsEnabled ??
      DEFAULT_SETTINGS.notificationsEnabled) as boolean,
    syncDirectoryHandle: map.syncDirectoryHandle as
      | FileSystemDirectoryHandle
      | undefined,
  };
}

export async function saveSettings(s: Settings): Promise<void> {
  const entries: Array<{ key: string; value: unknown }> = [
    { key: "audioEnabled", value: s.audioEnabled },
    { key: "categoriesMenuEnabled", value: s.categoriesMenuEnabled },
    { key: "analyticsMenuEnabled", value: s.analyticsMenuEnabled },
    { key: "rewardsMenuEnabled", value: s.rewardsMenuEnabled },
    { key: "animationsEnabled", value: s.animationsEnabled },
    { key: "notificationsEnabled", value: s.notificationsEnabled },
    { key: "matrixMenuEnabled", value: s.matrixMenuEnabled },
    { key: "syncDirectoryHandle", value: s.syncDirectoryHandle },
  ];
  await db.settings.bulkPut(entries);
}
