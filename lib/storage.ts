import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearCloudState, loadCloudState, saveCloudState } from "./firestore";
import { isFirebaseConfigured } from "./firebase";
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

export async function loadState(userId?: string) {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  let localState = initialState;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      localState = {
      ...initialState,
      ...parsed,
      settings: {
        ...initialState.settings,
        ...(parsed.settings ?? {})
      }
      };
    } catch {
      localState = initialState;
    }
  }

  if (userId && isFirebaseConfigured) {
    try {
      const cloudState = await loadCloudState(userId, localState);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudState));
      return cloudState;
    } catch {
      return localState;
    }
  }

  return localState;
}

export async function saveState(state: AppState, userId?: string) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (userId && isFirebaseConfigured) {
    try {
      await saveCloudState(userId, state);
    } catch {
      // Keep the local cache usable if the device is offline.
    }
  }
}

export async function clearState(userId?: string) {
  await AsyncStorage.removeItem(STORAGE_KEY);
  if (userId && isFirebaseConfigured) {
    try {
      await clearCloudState(userId);
    } catch {
      // The local reset still succeeds when Firestore is unavailable.
    }
  }
}
