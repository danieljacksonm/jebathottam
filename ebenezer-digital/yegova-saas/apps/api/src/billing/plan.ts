export const TRIAL_DAYS = 14;
export const ONLINE_MONTH_USD = 1;
export const OFFLINE_APP_USD = 5;

export type ShopPlan = {
  plan?: string | null;
  trialEndsAt?: Date | string | null;
  planExpiresAt?: Date | string | null;
};

export function addDays(from: Date, days: number) {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}

export function isPlanActive(shop: ShopPlan | null | undefined) {
  if (!shop) return false;
  // Website is always free.
  if (shop.plan === 'free' || !shop.plan) return true;
  const now = Date.now();
  if (shop.plan === 'online') {
    if (!shop.planExpiresAt) return true;
    return new Date(shop.planExpiresAt).getTime() > now;
  }
  if (shop.plan === 'trial') {
    if (!shop.trialEndsAt) return true;
    return new Date(shop.trialEndsAt).getTime() > now;
  }
  return true;
}

export function planPublic(shop: ShopPlan & { id: string; name: string }) {
  const trialEndsAt = shop.trialEndsAt
    ? new Date(shop.trialEndsAt).toISOString()
    : null;
  const planExpiresAt = shop.planExpiresAt
    ? new Date(shop.planExpiresAt).toISOString()
    : null;
  return {
    id: shop.id,
    name: shop.name,
    plan: shop.plan || 'free',
    trialEndsAt,
    planExpiresAt,
    active: true,
    websiteFree: true,
    trialDays: TRIAL_DAYS,
    onlineUsd: ONLINE_MONTH_USD,
    offlineUsd: OFFLINE_APP_USD,
  };
}
