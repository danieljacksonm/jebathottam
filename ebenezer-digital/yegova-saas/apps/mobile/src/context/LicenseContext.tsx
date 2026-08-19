import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppState,
  AppStateStatus,
} from 'react-native';
import {
  License,
  activateOfflineLifetime,
  activateOnlineLocal,
  daysLeft,
  isLicenseActive,
  isTrialExpired,
  loadLicense,
  startLocalTrial,
} from '../lib/license';
import { buyOfflineApp, buyOnlineMonthly } from '../lib/iap';
import { addDays } from '../lib/dates';

type LicenseContextValue = {
  ready: boolean;
  license: License;
  active: boolean;
  cloudDisabled: boolean;
  trialExpired: boolean;
  daysLeft: number;
  refresh: () => Promise<void>;
  startTrial: () => Promise<void>;
  buyOffline: () => Promise<void>;
  buyOnline: () => Promise<string>;
};

const LicenseContext = createContext<LicenseContextValue | null>(null);

export function LicenseProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [license, setLicense] = useState<License>({
    kind: 'none',
    cloudDisabled: false,
  });

  const refresh = useCallback(async () => {
    setLicense(await loadLicense());
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  // Re-check when user opens the app again (trial may have ended).
  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') refresh();
    };
    const sub = AppState.addEventListener('change', onChange);
    const timer = setInterval(() => {
      refresh();
    }, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, [refresh]);

  const startTrial = useCallback(async () => {
    setLicense(await startLocalTrial());
  }, []);

  const buyOffline = useCallback(async () => {
    await buyOfflineApp();
    setLicense(await activateOfflineLifetime());
  }, []);

  const buyOnline = useCallback(async () => {
    await buyOnlineMonthly();
    const expires = addDays(new Date(), 31).toISOString();
    setLicense(await activateOnlineLocal(expires));
    return expires;
  }, []);

  const active = isLicenseActive(license);
  const cloudDisabled = license.kind === 'offline' && license.cloudDisabled;
  const trialExpired = Boolean(isTrialExpired(license));
  const left =
    license.kind === 'trial'
      ? daysLeft(license.trialEndsAt)
      : license.kind === 'online'
        ? daysLeft(license.planExpiresAt)
        : 0;

  const value = useMemo(
    () => ({
      ready,
      license,
      active,
      cloudDisabled,
      trialExpired,
      daysLeft: left,
      refresh,
      startTrial,
      buyOffline,
      buyOnline,
    }),
    [
      ready,
      license,
      active,
      cloudDisabled,
      trialExpired,
      left,
      refresh,
      startTrial,
      buyOffline,
      buyOnline,
    ],
  );

  return (
    <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>
  );
}

export function useLicense() {
  const ctx = useContext(LicenseContext);
  if (!ctx) throw new Error('useLicense must be inside LicenseProvider');
  return ctx;
}
