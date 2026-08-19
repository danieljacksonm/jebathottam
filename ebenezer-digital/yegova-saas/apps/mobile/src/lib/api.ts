import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { isCloudDisabled } from './license';

const TOKEN_KEY = 'ebenezer_token';
const USER_KEY = 'ebenezer_user';
const SHOP_KEY = 'ebenezer_shop';

export const LOCAL_TOKEN = 'local-offline';

function defaultApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  // Android emulator reaches host machine via 10.0.2.2
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api';
  }
  return 'http://localhost:4000/api';
}

export const API_URL = defaultApiUrl();

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

export async function saveSession(session: AuthSession) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, session.accessToken],
    [USER_KEY, JSON.stringify(session.user)],
    [SHOP_KEY, JSON.stringify(session.shop)],
  ]);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, SHOP_KEY]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthSession['user']) : null;
}

export async function getStoredShop() {
  const raw = await AsyncStorage.getItem(SHOP_KEY);
  return raw ? (JSON.parse(raw) as AuthSession['shop']) : null;
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (await isCloudDisabled()) {
    throw new Error('This is the $5 offline app. It does not connect to the website.');
  }
  const token = await getToken();
  if (token === LOCAL_TOKEN) {
    throw new Error('This is the $5 offline app. It does not connect to the website.');
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

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
