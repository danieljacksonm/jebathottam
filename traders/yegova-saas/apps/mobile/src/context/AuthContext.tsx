import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  api,
  AuthSession,
  LOCAL_TOKEN,
  clearSession,
  getStoredShop,
  getStoredUser,
  getToken,
  saveSession,
} from '../lib/api';
import { isCloudDisabled } from '../lib/license';
import { clearOfflineData, loadCache, pullAll, saveCache } from '../lib/offline';

type AuthContextValue = {
  ready: boolean;
  token: string | null;
  user: AuthSession['user'] | null;
  shop: AuthSession['shop'] | null;
  signIn: (email: string, password: string) => Promise<AuthSession>;
  register: (input: {
    name: string;
    shopName: string;
    email: string;
    password: string;
  }) => Promise<AuthSession>;
  enterLocalShop: (input: {
    shopName: string;
    ownerName: string;
    gstin?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [shop, setShop] = useState<AuthSession['shop'] | null>(null);

  useEffect(() => {
    (async () => {
      const [t, u, s] = await Promise.all([
        getToken(),
        getStoredUser(),
        getStoredShop(),
      ]);
      setToken(t);
      setUser(u);
      setShop(s);
      setReady(true);
    })().catch(() => setReady(true));
  }, []);

  const applySession = useCallback(async (session: AuthSession) => {
    await saveSession(session);
    setToken(session.accessToken);
    setUser(session.user);
    setShop(session.shop);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const session = await api<AuthSession>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await applySession(session);
      pullAll().catch(() => undefined);
      return session;
    },
    [applySession],
  );

  const register = useCallback(
    async (input: {
      name: string;
      shopName: string;
      email: string;
      password: string;
    }) => {
      const session = await api<AuthSession>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      await applySession(session);
      pullAll().catch(() => undefined);
      return session;
    },
    [applySession],
  );

  const enterLocalShop = useCallback(
    async (input: { shopName: string; ownerName: string; gstin?: string }) => {
      const session: AuthSession = {
        accessToken: LOCAL_TOKEN,
        user: {
          id: 'local-owner',
          email: '',
          name: input.ownerName.trim() || 'Owner',
          role: 'owner',
        },
        shop: {
          id: 'local-shop',
          name: input.shopName.trim(),
          plan: 'offline',
          active: true,
        },
      };
      await applySession(session);
      const cache = await loadCache();
      cache.shop = {
        ...(cache.shop || {}),
        id: 'local-shop',
        name: input.shopName.trim(),
        gstin: input.gstin || cache.shop?.gstin || '',
        plan: 'offline',
        invoicePrefix: cache.shop?.invoicePrefix || 'INV',
        quotePrefix: cache.shop?.quotePrefix || 'QT',
        lowStockAt: cache.shop?.lowStockAt ?? 10,
      };
      await saveCache(cache);
    },
    [applySession],
  );

  const signOut = useCallback(async () => {
    const local = await isCloudDisabled();
    await clearSession();
    if (!local) await clearOfflineData();
    setToken(null);
    setUser(null);
    setShop(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      token,
      user,
      shop,
      signIn,
      register,
      enterLocalShop,
      signOut,
    }),
    [ready, token, user, shop, signIn, register, enterLocalShop, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
