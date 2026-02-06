import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setToken as storeToken, clearToken } from "../lib/api";

export type User = {
  id: string;
  email: string;
  role: "resident" | "admin";
  fullName: string;
  publicNickname: string;
  neighborhood?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  tokenBalance: number;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; fullName?: string; nickname?: string }) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    try {
      const r = await api<{ user: User }>("/api/auth/me");
      setUser(r.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const r = await api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    storeToken(r.token);
    setUser(r.user);
  }

  async function register(payload: { email: string; password: string; fullName?: string; nickname?: string }) {
    const r = await api<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    storeToken(r.token);
    setUser(r.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshMe }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

