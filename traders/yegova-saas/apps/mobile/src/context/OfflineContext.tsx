import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { pendingCount, syncAll } from '../lib/offline';
import { isCloudDisabled } from '../lib/license';

type OfflineContextValue = {
  online: boolean;
  pending: number;
  syncing: boolean;
  lastMessage: string;
  localOnly: boolean;
  syncNow: () => Promise<void>;
  refreshPending: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [localOnly, setLocalOnly] = useState(false);

  const refreshPending = useCallback(async () => {
    setPending(await pendingCount());
    setLocalOnly(await isCloudDisabled());
  }, []);

  const syncNow = useCallback(async () => {
    if (await isCloudDisabled()) {
      setLocalOnly(true);
      setLastMessage('Local app — no website');
      return;
    }
    setSyncing(true);
    try {
      const res = await syncAll();
      await refreshPending();
      setLastMessage(
        res.online
          ? res.queued
            ? `${res.queued} still waiting to sync`
            : 'Synced'
          : 'Offline — using phone copy',
      );
    } catch {
      setLastMessage('Sync failed — phone copy still works');
    } finally {
      setSyncing(false);
    }
  }, [refreshPending]);

  useEffect(() => {
    refreshPending();
    const unsub = NetInfo.addEventListener((state) => {
      const next = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      setOnline(next);
      isCloudDisabled().then((local) => {
        setLocalOnly(local);
        if (next && !local) syncNow();
      });
    });
    return () => unsub();
  }, [refreshPending, syncNow]);

  const value = useMemo(
    () => ({
      online,
      pending,
      syncing,
      lastMessage,
      localOnly,
      syncNow,
      refreshPending,
    }),
    [online, pending, syncing, lastMessage, localOnly, syncNow, refreshPending],
  );

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
}

export function useOffline() {
  const ctx = useContext(OfflineContext);
  if (!ctx) throw new Error('useOffline must be inside OfflineProvider');
  return ctx;
}
