import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { createAccount, signIn, signOutUser, subscribeToAuth } from "../lib/auth";
import { isFirebaseConfigured } from "../lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    return subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    configured: isFirebaseConfigured,
    signIn: async (email, password) => {
      await signIn(email, password);
    },
    createAccount: async (email, password) => {
      await createAccount(email, password);
    },
    signOut: async () => {
      await signOutUser();
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
