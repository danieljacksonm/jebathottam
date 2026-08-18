import { Platform } from 'react-native';
import { IAP_PRODUCTS, OFFLINE_USD, ONLINE_USD } from './license';

/**
 * Store products (Android Play + iOS App Store):
 *  - ebenezer_offline_lifetime  → $5 one time
 *  - ebenezer_online_monthly    → $1 / month
 *
 * Real IAP needs an EAS / store build. Expo Go cannot charge a card.
 * In Expo Go / dev we unlock locally so you can test the full app.
 */
export async function buyOfflineApp(): Promise<{ ok: true; productId: string }> {
  await pretendStoreSheet(`Offline app · $${OFFLINE_USD} once · ${Platform.OS}`);
  return { ok: true, productId: IAP_PRODUCTS.offline };
}

export async function buyOnlineMonthly(): Promise<{ ok: true; productId: string }> {
  await pretendStoreSheet(`Online app · $${ONLINE_USD} / month · ${Platform.OS}`);
  return { ok: true, productId: IAP_PRODUCTS.online };
}

async function pretendStoreSheet(label: string) {
  // Native StoreKit / Play Billing plugs in here for production EAS builds.
  if (__DEV__) {
    return;
  }
  return label;
}
