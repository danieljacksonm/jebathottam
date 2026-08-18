import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useLicense } from '../context/LicenseContext';
import { computeStats, getCache, refreshFromServer } from '../lib/repo';
import { colors, money } from '../lib/theme';
import { TRIAL_DAYS } from '../lib/license';
import {
  Card,
  Empty,
  ErrorBox,
  GhostButton,
  PrimaryButton,
  Screen,
  StatusBanner,
  Sub,
  Title,
} from '../components/ui';
import { AppStackParamList, RootTabParamList } from '../navigation/types';

export function HomeScreen() {
  const { shop } = useAuth();
  const offline = useOffline();
  const license = useLicense();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        BottomTabNavigationProp<RootTabParamList>,
        NativeStackNavigationProp<AppStackParamList>
      >
    >();
  const [stats, setStats] = useState<ReturnType<typeof computeStats> | null>(
    null,
  );
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      const cache = await getCache();
      setStats(computeStats(cache));
      await offline.refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load');
    }
  }, [offline]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refreshFromServer();
              await load();
              setRefreshing(false);
            }}
            tintColor={colors.forest}
          />
        }
      >
        <Text style={{ color: colors.brass, fontWeight: '700', fontSize: 12 }}>
          {shop?.name || stats?.shopName || 'Shop'}
        </Text>
        <Title>Today</Title>
        <Sub>Works online and fully offline on this phone.</Sub>
        {license.license.kind === 'trial' ? (
          <View
            style={{
              marginTop: 10,
              borderRadius: 14,
              padding: 12,
              backgroundColor:
                license.daysLeft <= 2
                  ? 'rgba(180,35,24,0.1)'
                  : 'rgba(154,120,64,0.16)',
            }}
          >
            <Text
              style={{
                fontWeight: '800',
                color:
                  license.daysLeft <= 2 ? colors.danger : colors.brass,
              }}
            >
              {license.daysLeft <= 0
                ? 'Trial ended — app will lock'
                : `Trial: ${license.daysLeft} of ${TRIAL_DAYS} days left`}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted, fontSize: 13 }}>
              After trial, bills are blocked until you pay $1 / month or $5
              offline. Website stays free.
            </Text>
          </View>
        ) : null}
        <StatusBanner
          online={offline.online}
          pending={offline.pending}
          syncing={offline.syncing}
          onSync={offline.syncNow}
        />
        <ErrorBox message={error} />

        <Card>
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>
            TODAY SALES
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontSize: 36,
              fontWeight: '600',
              color: colors.ink,
            }}
          >
            {money(stats?.todaySales || 0)}
          </Text>
          <Text style={{ marginTop: 4, color: colors.muted }}>
            from {stats?.todayBills || 0} bills
          </Text>
          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Items</Text>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>
                {stats?.products || 0}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                Customers
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>
                {stats?.customers || 0}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                Low stock
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: '700', color: colors.danger }}
              >
                {stats?.lowStockCount || 0}
              </Text>
            </View>
          </View>
        </Card>

        <PrimaryButton
          title="New bill"
          onPress={() => navigation.navigate('NewBill')}
        />
        <GhostButton
          title="View bills"
          onPress={() => navigation.navigate('Bills')}
        />

        <Text
          style={{
            marginTop: 24,
            marginBottom: 10,
            fontSize: 20,
            fontWeight: '600',
            color: colors.ink,
          }}
        >
          Recent bills
        </Text>
        {(stats?.recent || []).length === 0 ? (
          <Empty title="No bills yet" hint="Tap New bill. Works even offline." />
        ) : (
          stats?.recent.map((b: any) => (
            <Pressable
              key={b.id}
              onPress={() => navigation.navigate('BillDetail', { id: b.id })}
            >
            <Card>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.ink }}>
                    {b.invoiceLabel}
                  </Text>
                  <Text style={{ marginTop: 4, color: colors.muted }}>
                    {b.customer?.name || 'Walk-in'}
                    {b.pendingSync ? ' · saved on phone' : ''}
                  </Text>
                </View>
                <Text style={{ fontWeight: '700', color: colors.forest }}>
                  {money(b.grandTotal)}
                </Text>
              </View>
            </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
