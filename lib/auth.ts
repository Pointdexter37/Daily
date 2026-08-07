import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { firebaseApp } from "./firebase";

let auth: Auth | null = null;

if (firebaseApp) {
  try {
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch {
    auth = getAuth(firebaseApp);
  }
}

export function getFirebaseAuth() {
  if (!auth) {
    throw new Error("Firebase Auth is not configured.");
  }
  return auth;
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return auth.onAuthStateChanged(callback);
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export function createAccount(email: string, password: string) {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export function signOutUser() {
  return signOut(getFirebaseAuth());
}
