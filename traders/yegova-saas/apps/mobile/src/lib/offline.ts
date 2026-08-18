import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { api } from './api';

const CACHE_KEY = 'ebenezer_cache_v1';
const QUEUE_KEY = 'ebenezer_queue_v1';
const MAP_KEY = 'ebenezer_idmap_v1';

export type CacheState = {
  products: any[];
  customers: any[];
  bills: any[];
  quotes: any[];
  expenses: any[];
  stockMoves: any[];
  team: any[];
  activity: any[];
  shop: any | null;
  lastPullAt: string | null;
};

export type QueueItem = {
  id: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  localId?: string;
  createdAt: string;
};

const emptyCache = (): CacheState => ({
  products: [],
  customers: [],
  bills: [],
  quotes: [],
  expenses: [],
  stockMoves: [],
  team: [],
  activity: [],
  shop: null,
  lastPullAt: null,
});

let memory: CacheState | null = null;
let queueMem: QueueItem[] | null = null;
let idMap: Record<string, string> = {};

export function localId(prefix: string) {
  return `local_${prefix}_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

export function isLocalId(id?: string | null) {
  return !!id && id.startsWith('local_');
}

export async function isOnline() {
  const { isCloudDisabled } = await import('./license');
  if (await isCloudDisabled()) return false;
  const s = await NetInfo.fetch();
  return Boolean(s.isConnected && s.isInternetReachable !== false);
}

export async function loadCache(): Promise<CacheState> {
  if (memory) return memory;
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  memory = raw ? { ...emptyCache(), ...JSON.parse(raw) } : emptyCache();
  return memory!;
}

export async function saveCache(next: CacheState) {
  memory = next;
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
}

export async function loadQueue(): Promise<QueueItem[]> {
  if (queueMem) return queueMem;
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  queueMem = raw ? JSON.parse(raw) : [];
  return queueMem!;
}

export async function saveQueue(next: QueueItem[]) {
  queueMem = next;
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
}

export async function loadIdMap() {
  const raw = await AsyncStorage.getItem(MAP_KEY);
  idMap = raw ? JSON.parse(raw) : {};
  return idMap;
}

export async function saveIdMap() {
  await AsyncStorage.setItem(MAP_KEY, JSON.stringify(idMap));
}

export async function clearOfflineData() {
  memory = emptyCache();
  queueMem = [];
  idMap = {};
  await AsyncStorage.multiRemove([CACHE_KEY, QUEUE_KEY, MAP_KEY]);
}

export async function enqueue(item: Omit<QueueItem, 'id' | 'createdAt'>) {
  const q = await loadQueue();
  q.push({
    ...item,
    id: localId('q'),
    createdAt: new Date().toISOString(),
  });
  await saveQueue(q);
}

function rewriteIds(value: any): any {
  if (typeof value === 'string') return idMap[value] || value;
  if (Array.isArray(value)) return value.map(rewriteIds);
  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) out[k] = rewriteIds(v);
    return out;
  }
  return value;
}

function replaceIdInCache(cache: CacheState, from: string, to: string) {
  const walk = (rows: any[]) =>
    rows.map((row) => JSON.parse(JSON.stringify(rewriteIds({ ...row, id: row.id === from ? to : row.id }))));
  cache.products = walk(cache.products);
  cache.customers = walk(cache.customers);
  cache.bills = walk(cache.bills);
  cache.quotes = walk(cache.quotes);
  cache.expenses = walk(cache.expenses);
  cache.stockMoves = walk(cache.stockMoves);
  cache.team = walk(cache.team);
  cache.activity = walk(cache.activity);
}

export async function pullAll(): Promise<CacheState> {
  const [
    products,
    customers,
    bills,
    quotes,
    creditNotes,
    expenses,
    stockMoves,
    shop,
    team,
    activity,
  ] = await Promise.all([
    api<any[]>('/products'),
    api<any[]>('/customers'),
    api<any[]>('/bills'),
    api<any[]>('/bills?docType=quote'),
    api<any[]>('/bills?docType=credit_note').catch(() => []),
    api<any[]>('/expenses'),
    api<any[]>('/stock/history'),
    api<any>('/shop'),
    api<any[]>('/team').catch(() => []),
    api<any[]>('/activity').catch(() => []),
  ]);
  const next: CacheState = {
    products,
    customers,
    bills: [...bills, ...creditNotes],
    quotes,
    expenses,
    stockMoves,
    shop,
    team,
    activity,
    lastPullAt: new Date().toISOString(),
  };
  await saveCache(next);
  return next;
}

export async function flushQueue(): Promise<{ ok: number; fail: number }> {
  await loadIdMap();
  const q = await loadQueue();
  if (!q.length) return { ok: 0, fail: 0 };
  let ok = 0;
  let fail = 0;
  const remain: QueueItem[] = [];
  for (const item of q) {
    try {
      const path = rewriteIds(item.path);
      const body = item.body ? rewriteIds(item.body) : undefined;
      const res = await api<any>(path, {
        method: item.method,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (item.localId && res?.id) {
        idMap[item.localId] = res.id;
        await saveIdMap();
        const cache = await loadCache();
        replaceIdInCache(cache, item.localId, res.id);
        await saveCache(cache);
      }
      ok += 1;
    } catch {
      fail += 1;
      remain.push(item);
      // keep order: stop so later items don't skip dependencies
      remain.push(...q.slice(q.indexOf(item) + 1));
      break;
    }
  }
  await saveQueue(remain);
  return { ok, fail };
}

export async function syncAll(): Promise<{
  online: boolean;
  pulled: boolean;
  queued: number;
  flushed: number;
}> {
  const online = await isOnline();
  const queued = (await loadQueue()).length;
  if (!online) return { online: false, pulled: false, queued, flushed: 0 };
  const { ok, fail } = await flushQueue();
  const stillQueued = (await loadQueue()).length;
  // Do not pull if queue still has work — pull would wipe phone-only bills.
  if (fail || stillQueued) {
    return { online: true, pulled: false, queued: stillQueued, flushed: ok };
  }
  await pullAll();
  return {
    online: true,
    pulled: true,
    queued: 0,
    flushed: ok,
  };
}

export async function pendingCount() {
  return (await loadQueue()).length;
}
