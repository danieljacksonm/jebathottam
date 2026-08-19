const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export type AuthSession = {
  accessToken: string;
  user: { id: string; email: string; name: string; role?: string };
  shop: {
    id: string;
    name: string;
    plan: string;
    trialEndsAt?: string | null;
    planExpiresAt?: string | null;
    active?: boolean;
  };
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('yegova_token');
}

export function saveSession(session: AuthSession) {
  localStorage.setItem('yegova_token', session.accessToken);
  localStorage.setItem('yegova_user', JSON.stringify(session.user));
  localStorage.setItem('yegova_shop', JSON.stringify(session.shop));
}

export function clearSession() {
  localStorage.removeItem('yegova_token');
  localStorage.removeItem('yegova_user');
  localStorage.removeItem('yegova_shop');
}

export function getShop(): AuthSession['shop'] | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('yegova_shop');
  return raw ? JSON.parse(raw) : null;
}

export function getUser(): {
  id: string;
  email: string;
  name: string;
  role?: string;
} | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('yegova_user');
  return raw ? JSON.parse(raw) : null;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((cell) => {
          const v = String(cell ?? '');
          return /[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v;
        })
        .join(','),
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data && (data.message as string | string[])) || 'Request failed';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return data as T;
}
