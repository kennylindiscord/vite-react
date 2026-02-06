export async function apiJSON<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    credentials: "include"
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.error?.message || data?.error || message;
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function apiUpload(path: string, file: File): Promise<{ id: string; url: string }> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(path, { method: "POST", body: fd, credentials: "include" });
  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.error?.message || data?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

