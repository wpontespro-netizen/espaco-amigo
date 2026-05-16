import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider?: "google" | "credentials";
  age?: number;
  birthMonth?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  age: string;
  birthMonth: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  errors?: Record<string, string>;
}

interface AuthContextValue {
  completeProfile: (payload: Pick<RegisterPayload, "age" | "birthMonth">) => Promise<AuthResult>;
  isLoading: boolean;
  loginWithEmail: (payload: Pick<RegisterPayload, "email" | "password">) => Promise<AuthResult>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  registerWithEmail: (payload: RegisterPayload) => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
  updateProfile: (payload: Pick<RegisterPayload, "name" | "age" | "birthMonth">) => Promise<AuthResult>;
  user: AuthUser | null;
}

const CURRENT_USER_KEY = "espacoAmigoCurrentUser";
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
      if (data.user) localStorage.setItem(CURRENT_USER_KEY, data.user.email);
      else localStorage.removeItem(CURRENT_USER_KEY);
    } catch {
      setUser(null);
      localStorage.removeItem(CURRENT_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const submitAuth = async (path: string, payload: unknown) => {
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok: boolean;
        user?: AuthUser;
        error?: string;
        errors?: Record<string, string>;
      };
      if (response.ok && data.user) {
        setUser(data.user);
        localStorage.setItem(CURRENT_USER_KEY, data.user.email);
      }
      return { ok: response.ok && data.ok, error: data.error, errors: data.errors };
    } catch {
      return { ok: false, error: "Não foi possível continuar agora. Tente novamente em instantes." };
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      completeProfile: (payload) => submitAuth("/api/auth/complete-profile", payload),
      isLoading,
      loginWithEmail: (payload) => submitAuth("/api/auth/login", payload),
      loginWithGoogle: () => {
        window.location.href = "/api/auth/google/start?mode=login";
      },
      logout: async () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      },
      registerWithEmail: (payload) => submitAuth("/api/auth/register", payload),
      refreshSession,
      updateProfile: (payload) => submitAuth("/api/auth/update-profile", payload),
      user,
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
