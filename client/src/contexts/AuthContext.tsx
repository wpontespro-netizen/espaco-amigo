import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextValue {
  isLoading: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/session");
      const data = (await response.json()) as { user: AuthUser | null };
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      loginWithGoogle: () => {
        window.location.href = "/api/auth/google/start";
      },
      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      },
      refreshSession,
      user,
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
