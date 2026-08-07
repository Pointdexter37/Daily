import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, writeBatch } from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { AppState, DayRecord } from "./types";

const db = firebaseApp ? getFirestore(firebaseApp) : null;

function requireDb() {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }
  return db;
}

function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function loadCloudState(userId: string, fallback: AppState): Promise<AppState> {
  const firestore = requireDb();
  const [metaSnapshot, daysSnapshot] = await Promise.all([
    getDoc(doc(firestore, "users", userId, "meta", "app")),
    getDocs(collection(firestore, "users", userId, "days"))
  ]);

  const meta = metaSnapshot.exists() ? (metaSnapshot.data() as Partial<AppState>) : {};
  const days = Object.fromEntries(daysSnapshot.docs.map((item) => [item.id, item.data() as DayRecord]));
  return {
    ...fallback,
    ...meta,
    days: Object.keys(days).length ? days : fallback.days,
    settings: {
      ...fallback.settings,
      ...(meta.settings ?? {})
    }
  };
}

export async function saveCloudState(userId: string, state: AppState) {
  const firestore = requireDb();
  const batch = writeBatch(firestore);
  const metaRef = doc(firestore, "users", userId, "meta", "app");
  batch.set(metaRef, clean({ preview: state.preview, settings: state.settings }));
  Object.values(state.days).forEach((day) => {
    batch.set(doc(firestore, "users", userId, "days", day.date), clean(day));
  });
  await batch.commit();
}

export async function clearCloudState(userId: string) {
  const firestore = requireDb();
  const daysSnapshot = await getDocs(collection(firestore, "users", userId, "days"));
  const batch = writeBatch(firestore);
  daysSnapshot.docs.forEach((item) => batch.delete(item.ref));
  batch.delete(doc(firestore, "users", userId, "meta", "app"));
  await batch.commit();
}

export async function deleteCloudDay(userId: string, date: string) {
  await deleteDoc(doc(requireDb(), "users", userId, "days", date));
}
