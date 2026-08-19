import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOffline } from '../context/OfflineContext';
import {
  duplicateBill,
  listBills,
  markBillPaid,
  voidBill,
} from '../lib/repo';
import { colors, money } from '../lib/theme';
import {
  Card,
  Empty,
  ErrorBox,
  Screen,
  StatusBanner,
  Sub,
  Title,
} from '../components/ui';
import { AppStackParamList, RootTabParamList } from '../navigation/types';

type Bill = {
  id: string;
  invoiceLabel: string;
  grandTotal: number;
  paidAmount: number;
  status: string;
  billDate: string;
  customer?: { name: string } | null;
  pendingSync?: boolean;
};

export function BillsScreen() {
  const offline = useOffline();
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<RootTabParamList>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();
  const [items, setItems] = useState<Bill[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await listBills('invoice'));
      await offline.refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load bills');
    }
  }, [offline]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function act(fn: () => Promise<unknown>) {
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    }
  }

  return (
    <Screen>
      <Title>Bills</Title>
      <Sub>Mark paid, void or copy. Works offline.</Sub>
      <StatusBanner
        online={offline.online}
        pending={offline.pending}
        syncing={offline.syncing}
        onSync={offline.syncNow}
      />
      <ErrorBox message={error} />
      <FlatList
        style={{ marginTop: 12 }}
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
            tintColor={colors.forest}
          />
        }
        ListEmptyComponent={
          <Empty title="No bills" hint="Create a bill from the New bill tab." />
        }
        renderItem={({ item }) => (
          <Card>
            <Pressable
              onPress={() => navigation.navigate('BillDetail', { id: item.id })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.ink }}>
                    {item.invoiceLabel}
                  </Text>
                  <Text style={{ marginTop: 4, color: colors.muted }}>
                    {item.customer?.name || 'Walk-in'} ·{' '}
                    {new Date(item.billDate).toLocaleDateString('en-IN')}
                    {item.pendingSync ? ' · phone' : ''}
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      alignSelf: 'flex-start',
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      overflow: 'hidden',
                      backgroundColor:
                        item.status === 'paid'
                          ? 'rgba(31,122,77,0.12)'
                          : 'rgba(180,35,24,0.1)',
                      color:
                        item.status === 'paid' ? colors.ok : colors.danger,
                      fontSize: 12,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '700' }}>
                    {money(item.grandTotal)}
                  </Text>
                  <Text style={{ marginTop: 4, color: colors.muted, fontSize: 12 }}>
                    Paid {money(item.paidAmount)}
                  </Text>
                </View>
              </View>
            </Pressable>
            {item.status !== 'void' ? (
              <View style={{ flexDirection: 'row', gap: 14, marginTop: 12 }}>
                {item.status !== 'paid' ? (
                  <Pressable onPress={() => act(() => markBillPaid(item))}>
                    <Text style={{ color: colors.forest, fontWeight: '700' }}>
                      Mark paid
                    </Text>
                  </Pressable>
                ) : null}
                <Pressable onPress={() => act(() => duplicateBill(item))}>
                  <Text style={{ color: colors.forest, fontWeight: '700' }}>
                    Copy
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    Alert.alert('Void bill?', item.invoiceLabel, [
                      { text: 'No' },
                      {
                        text: 'Void',
                        style: 'destructive',
                        onPress: () => act(() => voidBill(item)),
                      },
                    ])
                  }
                >
                  <Text style={{ color: colors.danger, fontWeight: '700' }}>
                    Void
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </Card>
        )}
      />
    </Screen>
  );
}
