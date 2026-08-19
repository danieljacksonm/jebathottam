import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'ebenezer_license_v1';
/** Survives sign-out. Stops second free trial on same phone. */
const TRIAL_USED_KEY = 'ebenezer_trial_used_v1';

export const TRIAL_DAYS = 14;
export const ONLINE_USD = 1;
export const OFFLINE_USD = 5;

export const LICENSE_EXPIRED_MSG =
  'Phone trial ended. Pay $1 / month for the online app, or buy the $5 offline app. The website stays free.';

export const IAP_PRODUCTS = {
  offline: 'ebenezer_offline_lifetime',
  online: 'ebenezer_online_monthly',
};

export type LicenseKind = 'none' | 'trial' | 'online' | 'offline';

export type License = {
  kind: LicenseKind;
  trialEndsAt?: string | null;
  trialStartedAt?: string | null;
  planExpiresAt?: string | null;
  purchasedAt?: string | null;
  /** $5 app: never call website / API */
  cloudDisabled: boolean;
  /** One free trial per phone — cannot start again */
  trialUsed?: boolean;
};

const empty = (): License => ({
  kind: 'none',
  cloudDisabled: false,
  trialUsed: false,
});

let memory: License | null = null;

export async function loadLicense(): Promise<License> {
  if (memory) {
    return hardenLicense(memory);
  }
  const [raw, usedFlag] = await Promise.all([
    AsyncStorage.getItem(KEY),
    AsyncStorage.getItem(TRIAL_USED_KEY),
  ]);
  const base = raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  if (usedFlag === '1') base.trialUsed = true;
  memory = hardenLicense(base);
  if (JSON.stringify(memory) !== JSON.stringify(base)) {
    await AsyncStorage.setItem(KEY, JSON.stringify(memory));
  }
  return memory!;
}

/** Fix clock tricks / missing end date / expired state. */
function hardenLicense(lic: License): License {
  const next = { ...lic };
  if (next.kind === 'trial') {
    next.trialUsed = true;
    if (!next.trialEndsAt && next.trialStartedAt) {
      next.trialEndsAt = new Date(
        new Date(next.trialStartedAt).getTime() + TRIAL_DAYS * 86400000,
      ).toISOString();
    }
    if (!next.trialEndsAt) {
      next.kind = 'none';
      next.trialUsed = true;
    } else if (new Date(next.trialEndsAt).getTime() <= Date.now()) {
      // Keep kind trial but inactive — paywall shows "ended"
    }
  }
  if (next.kind === 'online' && next.planExpiresAt) {
    // expired online stays kind online but inactive
  }
  return next;
}

export async function saveLicense(next: License) {
  const hardened = hardenLicense(next);
  memory = hardened;
  const ops: [string, string][] = [[KEY, JSON.stringify(hardened)]];
  if (hardened.trialUsed || hardened.kind === 'trial') {
    ops.push([TRIAL_USED_KEY, '1']);
  }
  await AsyncStorage.multiSet(ops);
}

export function isLicenseActive(lic: License) {
  const now = Date.now();
  if (lic.kind === 'offline' && lic.cloudDisabled) return true;
  if (lic.kind === 'online') {
    if (!lic.planExpiresAt) return false;
    return new Date(lic.planExpiresAt).getTime() > now;
  }
  if (lic.kind === 'trial') {
    if (!lic.trialEndsAt) return false;
    return new Date(lic.trialEndsAt).getTime() > now;
  }
  return false;
}

export function isTrialExpired(lic: License) {
  return (
    (lic.kind === 'trial' || lic.trialUsed) &&
    !!lic.trialEndsAt &&
    new Date(lic.trialEndsAt).getTime() <= Date.now() &&
    !isLicenseActive(lic)
  );
}

export function daysLeft(iso?: string | null) {
  if (!iso) return 0;
  return Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000),
  );
}

export async function assertCanUseApp() {
  const lic = await loadLicense();
  if (isLicenseActive(lic)) return lic;
  throw new Error(LICENSE_EXPIRED_MSG);
}

export async function startLocalTrial() {
  const current = await loadLicense();
  if (current.kind === 'offline' && current.cloudDisabled) return current;
  if (current.kind === 'online' && isLicenseActive(current)) return current;
  if (current.trialUsed || current.kind === 'trial') {
    throw new Error(
      'Free phone trial already used on this device. Pay $1 / month or buy the $5 offline app.',
    );
  }
  const started = new Date();
  const next: License = {
    kind: 'trial',
    cloudDisabled: false,
    trialUsed: true,
    trialStartedAt: started.toISOString(),
    trialEndsAt: new Date(
      started.getTime() + TRIAL_DAYS * 86400000,
    ).toISOString(),
  };
  await saveLicense(next);
  return next;
}

export async function applyServerShop(_shop: {
  plan?: string;
  trialEndsAt?: string | null;
  planExpiresAt?: string | null;
  active?: boolean;
}) {
  // Website is free. Phone license is separate — do not copy website plan.
  return loadLicense();
}

export async function activateOfflineLifetime() {
  const current = await loadLicense();
  const next: License = {
    kind: 'offline',
    cloudDisabled: true,
    trialUsed: current.trialUsed || current.kind === 'trial',
    trialEndsAt: current.trialEndsAt,
    trialStartedAt: current.trialStartedAt,
    purchasedAt: new Date().toISOString(),
  };
  await saveLicense(next);
  return next;
}

export async function activateOnlineLocal(expiresAt: string) {
  const current = await loadLicense();
  const next: License = {
    kind: 'online',
    cloudDisabled: false,
    planExpiresAt: expiresAt,
    trialUsed: true,
    trialEndsAt: current.trialEndsAt,
    trialStartedAt: current.trialStartedAt,
    purchasedAt: new Date().toISOString(),
  };
  await saveLicense(next);
  return next;
}

export async function isCloudDisabled() {
  const lic = await loadLicense();
  return lic.kind === 'offline' && lic.cloudDisabled;
}
