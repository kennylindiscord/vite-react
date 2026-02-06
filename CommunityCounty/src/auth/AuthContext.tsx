import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setToken, clearToken, getToken } from "../api/client";

export type User = {
  id: string;
  email: string;
  full_name: string;
  nickname: string;
  role: "resident" | "admin";
  token_balance: number;
  created_date: string;
  neighborhood?: string;
  phone?: string;
  bio?: string;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const res = await api<{ user: User }>("/api/auth/me");
    setUser(res.user);
  }

  async function login(email: string, password: string) {
    const res = await api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setUser(res.user);
  }

  async function register(email: string, password: string, full_name: string) {
    const res = await api<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    });
    setToken(res.token);
    setUser(res.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshMe }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AuthProvider missing");
  return v;
}

