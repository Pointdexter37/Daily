import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { buildTomorrowPreview, completionRateForDay } from "../lib/planner";
import { clearState, loadState, saveState, initialState } from "../lib/storage";
import { AppState, DayRecord, Priority, Task } from "../lib/types";
import { speakTasks as speakTasksImpl } from "../lib/voice";
import { useAuth } from "./AuthProvider";

type AppContextValue = {
  state: AppState;
  ready: boolean;
  actions: {
    addTask: (date: string, title: string, priority: Priority) => Promise<void>;
    toggleTask: (date: string, taskId: string) => Promise<void>;
    deleteTask: (date: string, taskId: string) => Promise<void>;
    renameTask: (date: string, taskId: string, title: string) => Promise<void>;
    closeDay: (date: string) => Promise<void>;
    acceptPreview: () => Promise<void>;
    movePreviewTask: (taskId: string, direction: -1 | 1) => Promise<void>;
    renamePreviewTask: (taskId: string, title: string) => Promise<void>;
    removePreviewTask: (taskId: string) => Promise<void>;
    updateSettings: (partial: Partial<AppState["settings"]>) => Promise<void>;
    resetAll: () => Promise<void>;
    speakTasks: (tasks: string[]) => void;
  };
};

const AppContext = createContext<AppContextValue | null>(null);

function createTask(title: string, priority: Priority): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    done: false,
    priority,
    createdAt: new Date().toISOString()
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const [loadedForUser, setLoadedForUser] = useState<string | undefined>();

  useEffect(() => {
    let mounted = true;
    setReady(false);
    loadState(user?.uid).then((next) => {
      if (!mounted) {
        return;
      }
      setState(next);
      setLoadedForUser(user?.uid);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!ready || loadedForUser !== user?.uid) {
      return;
    }
    saveState(state, user?.uid);
  }, [loadedForUser, ready, state, user?.uid]);

  const updateDay = (date: string, updater: (day: DayRecord) => DayRecord) => {
    setState((current) => {
      const existing = current.days[date] ?? {
        date,
        tasks: [],
        completionRate: 0,
        closedAt: null
      };
      const nextDay = updater(existing);
      return {
        ...current,
        days: {
          ...current.days,
          [date]: nextDay
        }
      };
    });
  };

  const actions: AppContextValue["actions"] = {
    addTask: async (date, title, priority) => {
      const cleaned = title.trim();
      if (!cleaned) {
        return;
      }
      const task = createTask(cleaned, priority);
      updateDay(date, (day) => ({
        ...day,
        tasks: [...day.tasks, task],
        closedAt: null,
        completionRate: completionRateForDay([...day.tasks, task])
      }));
    },
    toggleTask: async (date, taskId) => {
      updateDay(date, (day) => {
        const nextTasks = day.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task));
        return {
          ...day,
          tasks: nextTasks,
          completionRate: completionRateForDay(nextTasks)
        };
      });
    },
    deleteTask: async (date, taskId) => {
      updateDay(date, (day) => {
        const nextTasks = day.tasks.filter((task) => task.id !== taskId);
        return {
          ...day,
          tasks: nextTasks,
          completionRate: completionRateForDay(nextTasks)
        };
      });
    },
    renameTask: async (date, taskId, title) => {
      const trimmed = title.trim();
      if (!trimmed) {
        return;
      }
      updateDay(date, (day) => ({
        ...day,
        tasks: day.tasks.map((task) => (task.id === taskId ? { ...task, title: trimmed } : task))
      }));
    },
    closeDay: async (date) => {
      const day = state.days[date] ?? { date, tasks: [], completionRate: 0, closedAt: null };
      if (day.closedAt) {
        return;
      }
      const nextDayHistory = Object.values(state.days).filter((record) => record.date < date).slice(-6);
      const closedDay: DayRecord = {
        ...day,
        completionRate: completionRateForDay(day.tasks),
        closedAt: new Date().toISOString()
      };
      const preview = buildTomorrowPreview(closedDay, nextDayHistory);
      setState((current) => ({
        ...current,
        days: {
          ...current.days,
          [date]: closedDay
        },
        preview
      }));
    },
    acceptPreview: async () => {
      setState((current) => {
        if (!current.preview) {
          return current;
        }
        const tomorrow = current.preview.targetDate;
        const tasks = current.preview.tasks.map((item) => ({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title: item.title,
          done: false,
          priority: item.priority,
          carriedOverFrom: item.carriedOverFrom,
          createdAt: new Date().toISOString()
        }));
        const day: DayRecord = {
          date: tomorrow,
          tasks,
          completionRate: completionRateForDay(tasks),
          closedAt: null
        };
        return {
          ...current,
          days: {
            ...current.days,
            [tomorrow]: day
          },
          preview: null
        };
      });
    },
    movePreviewTask: async (taskId, direction) => {
      setState((current) => {
        if (!current.preview) {
          return current;
        }
        const index = current.preview.tasks.findIndex((task) => task.id === taskId);
        if (index < 0) {
          return current;
        }
        const target = index + direction;
        if (target < 0 || target >= current.preview.tasks.length) {
          return current;
        }
        const tasks = [...current.preview.tasks];
        const [selected] = tasks.splice(index, 1);
        tasks.splice(target, 0, selected);
        return {
          ...current,
          preview: {
            ...current.preview,
            tasks
          }
        };
      });
    },
    renamePreviewTask: async (taskId, title) => {
      const trimmed = title.trim();
      if (!trimmed) {
        return;
      }
      setState((current) => {
        if (!current.preview) {
          return current;
        }
        return {
          ...current,
          preview: {
            ...current.preview,
            tasks: current.preview.tasks.map((task) => (task.id === taskId ? { ...task, title: trimmed } : task))
          }
        };
      });
    },
    removePreviewTask: async (taskId) => {
      setState((current) => {
        if (!current.preview) {
          return current;
        }
        return {
          ...current,
          preview: {
            ...current.preview,
            tasks: current.preview.tasks.filter((task) => task.id !== taskId)
          }
        };
      });
    },
    updateSettings: async (partial) => {
      setState((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...partial
        }
      }));
    },
    resetAll: async () => {
      await clearState(user?.uid);
      setState(initialState);
      Alert.alert("Reset complete", user ? "Your cloud and local data were cleared." : "Local data was cleared on this device.");
    },
    speakTasks: (tasks) => {
      if (!state.settings.voiceEnabled) {
        Alert.alert("Voice disabled", "Enable read-aloud in Settings first.");
        return;
      }
      speakTasksImpl(tasks);
    }
  };

  const value: AppContextValue = {
    state,
    ready,
    actions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useDailyFlow() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useDailyFlow must be used inside AppProvider");
  }
  return context;
}
