const TOKEN_KEY = "cc_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type ApiError = { error?: string; message?: string };

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = (isJson ? await res.json() : null) as any;

  if (!res.ok) {
    const err = (data as ApiError)?.error ?? res.statusText;
    throw new Error(err);
  }
  return data as T;
}

