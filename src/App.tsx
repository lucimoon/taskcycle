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
const WheelListView = lazy(() =>
  import("@/views/WheelListView").then((m) => ({ default: m.WheelListView })),
);
const WheelSetupView = lazy(() =>
  import("@/views/WheelSetupView").then((m) => ({ default: m.WheelSetupView })),
);
const WheelView = lazy(() =>
  import("@/views/WheelView").then((m) => ({ default: m.WheelView })),
);
import { RewardNotification } from "@/components/rewards/RewardNotification";
import { AppHeader } from "@/components/AppHeader";
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
      <AppHeader theme={theme} onThemeToggle={toggleTheme} />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<TaskListView />} />
          <Route path="/taskcycle" element={<TaskListView />} />
          <Route path="/taskcycle/matrix" element={<MatrixView />} />
          <Route path="/taskcycle/tasks/new" element={<TaskFormView />} />
          <Route path="/taskcycle/tasks/:id/edit" element={<TaskFormView />} />
          <Route path="/taskcycle/rewards" element={<RewardsView />} />
          <Route path="/taskcycle/settings" element={<SettingsView />} />
          <Route
            path="/taskcycle/categories"
            element={<CategoryManagementView />}
          />
          <Route
            path="/taskcycle/analytics"
            element={<CategoryAnalyticsView />}
          />
          <Route path="/taskcycle/wheels" element={<WheelListView />} />
          <Route path="/taskcycle/wheels/new" element={<WheelSetupView />} />
          <Route path="/taskcycle/wheels/:id" element={<WheelView />} />
        </Routes>
      </Suspense>
      <RewardNotification />
    </>
  );
}

export function App() {
  return <AppShell />;
}
