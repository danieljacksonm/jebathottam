import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { convertQuote, listBills, voidBill } from '../lib/repo';
import { useOffline } from '../context/OfflineContext';
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

export function QuotesScreen() {
  const navigation = useNavigation();
  const offline = useOffline();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await listBills('quote'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load quotes');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Title>Quotes</Title>
      <Sub>Convert estimate into a bill.</Sub>
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
        keyExtractor={(i) => i.id}
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
        ListEmptyComponent={<Empty title="No quotes" hint="Make one from New bill → Quote." />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700' }}>{item.invoiceLabel}</Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {item.customer?.name || 'Walk-in'} · {money(item.grandTotal)} · {item.status}
            </Text>
            {item.status === 'draft' ? (
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
                <Pressable
                  onPress={async () => {
                    await convertQuote(item);
                    await load();
                    Alert.alert('Converted', 'Quote is now a bill.');
                  }}
                >
                  <Text style={{ color: colors.forest, fontWeight: '700' }}>
                    Make bill
                  </Text>
                </Pressable>
                <Pressable
                  onPress={async () => {
                    await voidBill(item);
                    await load();
                  }}
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
