import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "./types";

export const STORAGE_KEY = "dailyflow.state.v1";

export const initialState: AppState = {
  days: {},
  preview: null,
  settings: {
    voiceEnabled: true,
    reminderTime: "19:30"
  }
};

export async function loadState() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initialState,
      ...parsed,
      settings: {
        ...initialState.settings,
        ...(parsed.settings ?? {})
      }
    };
  } catch {
    return initialState;
  }
}

export async function saveState(state: AppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
