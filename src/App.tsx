import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { TaskListView } from "@/views/TaskListView";

const TaskFormView = lazy(() =>
  import("@/views/TaskFormView").then((m) => ({ default: m.TaskFormView })),
);
const MatrixView = lazy(() =>
  import("@/views/MatrixView").then((m) => ({ default: m.MatrixView })),
);
const RewardsView = lazy(() =>
  import("@/views/RewardsView").then((m) => ({ default: m.RewardsView })),
);
const SettingsView = lazy(() =>
  import("@/views/SettingsView").then((m) => ({ default: m.SettingsView })),
);
const CategoryManagementView = lazy(() =>
  import("@/views/CategoryManagementView").then((m) => ({
    default: m.CategoryManagementView,
  })),
);
const CategoryAnalyticsView = lazy(() =>
  import("@/views/CategoryAnalyticsView").then((m) => ({
    default: m.CategoryAnalyticsView,
  })),
);
import { RewardNotification } from "@/components/rewards/RewardNotification";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore } from "@/store/settingsStore";
import { useCategoryStore } from "@/store/categoryStore";
import { syncIfConfigured } from "@/services/sync/fileSyncService";

function AppShell() {
  useNotificationScheduler();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    useSettingsStore
      .getState()
      .loadSettings()
      .then(() => {
        syncIfConfigured();
      });
    useCategoryStore.getState().loadCategories();
  }, []);
  const toggleTheme = () => setTheme(theme === "classic" ? "dusk" : "classic");
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route
            path="/"
            element={<TaskListView theme={theme} onThemeToggle={toggleTheme} />}
          />
          <Route
            path="/taskcycle"
            element={<TaskListView theme={theme} onThemeToggle={toggleTheme} />}
          />
          <Route
            path="/matrix"
            element={<MatrixView theme={theme} onThemeToggle={toggleTheme} />}
          />
          <Route path="/tasks/new" element={<TaskFormView />} />
          <Route path="/tasks/:id/edit" element={<TaskFormView />} />
          <Route path="/rewards" element={<RewardsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/categories" element={<CategoryManagementView />} />
          <Route path="/analytics" element={<CategoryAnalyticsView />} />
        </Routes>
      </Suspense>
      <RewardNotification />
    </>
  );
}

export function App() {
  return <AppShell />;
}
