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

type StoredUser = AuthUser & { passwordHash?: string };

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

interface AuthResult {
  ok: boolean;
  error?: string;
  errors?: Record<string, string>;
}

const USERS_KEY = "espacoAmigoUsers";
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
      if (data.user) {
        const merged = upsertUser({ ...data.user, provider: "google" });
        saveCurrentUser(merged);
        setUser(publicUser(merged));
        return;
      }

      const current = getCurrentUser();
      setUser(current ? publicUser(current) : null);
    } catch {
      const current = getCurrentUser();
      setUser(current ? publicUser(current) : null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      completeProfile: async (payload) => {
        const current = getCurrentUser();
        if (!current) return { ok: false, error: "Sessão não encontrada." };

        const errors = validateProfile(payload);
        if (Object.keys(errors).length > 0) return { ok: false, errors };

        const updated = upsertUser({
          ...current,
          age: Number(payload.age),
          birthMonth: payload.birthMonth,
        });
        saveCurrentUser(updated);
        setUser(publicUser(updated));

        void fetch("/api/auth/complete-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => undefined);

        return { ok: true };
      },
      isLoading,
      loginWithEmail: async (payload) => {
        const email = normalizeEmail(payload.email);
        const errors: Record<string, string> = {};
        if (!isValidEmail(email)) errors.email = "Informe um email válido.";
        if (!payload.password) errors.password = "Informe sua senha.";
        if (Object.keys(errors).length > 0) return { ok: false, errors };

        const storedUser = getUsers()[email];
        if (!storedUser || storedUser.provider !== "credentials" || storedUser.passwordHash !== hashPassword(email, payload.password)) {
          return { ok: false, error: "Email ou senha inválidos." };
        }

        saveCurrentUser(storedUser);
        setUser(publicUser(storedUser));
        return { ok: true };
      },
      loginWithGoogle: () => {
        window.location.href = "/api/auth/google/start?mode=login";
      },
      logout: async () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      },
      registerWithEmail: async (payload) => {
        const email = normalizeEmail(payload.email);
        const errors = validateSignup({ ...payload, email });
        if (Object.keys(errors).length > 0) return { ok: false, errors };

        const users = getUsers();
        if (users[email]) return { ok: false, errors: { email: "Este email já possui uma conta." } };

        const newUser: StoredUser = {
          id: `email:${email}`,
          name: payload.name.trim(),
          email,
          provider: "credentials",
          passwordHash: hashPassword(email, payload.password),
          age: Number(payload.age),
          birthMonth: payload.birthMonth,
        };
        users[email] = newUser;
        saveUsers(users);
        saveCurrentUser(newUser);
        setUser(publicUser(newUser));

        return { ok: true };
      },
      refreshSession,
      updateProfile: async (payload) => {
        const current = getCurrentUser();
        if (!current) return { ok: false, error: "Sessão não encontrada." };

        const errors = validateProfile(payload, true);
        if (Object.keys(errors).length > 0) return { ok: false, errors };

        const updated = upsertUser({
          ...current,
          name: payload.name.trim(),
          age: Number(payload.age),
          birthMonth: payload.birthMonth,
        });
        saveCurrentUser(updated);
        setUser(publicUser(updated));
        return { ok: true };
      },
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

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}") as Record<string, StoredUser>;
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const email = normalizeEmail(localStorage.getItem(CURRENT_USER_KEY) || "");
  return email ? getUsers()[email] || null : null;
}

function saveCurrentUser(savedUser: StoredUser) {
  localStorage.setItem(CURRENT_USER_KEY, normalizeEmail(savedUser.email));
}

function upsertUser(nextUser: StoredUser) {
  const email = normalizeEmail(nextUser.email);
  const users = getUsers();
  const previous = users[email];
  const merged: StoredUser = {
    ...previous,
    ...nextUser,
    email,
    age: nextUser.age || previous?.age,
    birthMonth: nextUser.birthMonth || previous?.birthMonth,
    provider: previous?.provider === "credentials" ? previous.provider : nextUser.provider,
    passwordHash: previous?.passwordHash || nextUser.passwordHash,
  };
  users[email] = merged;
  saveUsers(users);
  return merged;
}

function publicUser(savedUser: StoredUser): AuthUser {
  const { passwordHash: _passwordHash, ...safeUser } = savedUser;
  return safeUser;
}

function validateSignup(payload: RegisterPayload) {
  const errors = validateProfile(payload, true);
  const email = normalizeEmail(payload.email);
  if (!isValidEmail(email)) errors.email = "Informe um email válido.";
  if (payload.password.length < 6) errors.password = "A senha precisa ter pelo menos 6 caracteres.";
  return errors;
}

function validateProfile(payload: Pick<RegisterPayload, "age" | "birthMonth"> & Partial<Pick<RegisterPayload, "name">>, requireName = false) {
  const errors: Record<string, string> = {};
  const age = Number(payload.age);
  if (requireName && !payload.name?.trim()) errors.name = "Informe seu nome.";
  if (!String(payload.age || "").trim()) errors.age = "Informe sua idade.";
  else if (!Number.isFinite(age) || age < 13) errors.age = "A idade mínima é 13 anos.";
  if (!payload.birthMonth) errors.birthMonth = "Escolha o mês de nascimento.";
  return errors;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(email: string, password: string) {
  return btoa(`${email}:${password}`);
}
