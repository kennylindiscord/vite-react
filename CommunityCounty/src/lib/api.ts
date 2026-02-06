const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export type ApiError = { error: string };

export function getToken() {
  return localStorage.getItem("auth_token") || "";
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
}

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as ApiError)?.error || "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

