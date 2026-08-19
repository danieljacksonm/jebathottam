import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listActivity } from '../lib/repo';
import { useOffline } from '../context/OfflineContext';
import { colors } from '../lib/theme';
import {
  Card,
  Empty,
  Screen,
  StatusBanner,
  Sub,
  Title,
} from '../components/ui';

export function ActivityScreen() {
  const navigation = useNavigation();
  const offline = useOffline();
  const [items, setItems] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      listActivity().then(setItems).catch(() => setItems([]));
    }, []),
  );

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Title>Activity</Title>
      <Sub>Who did what in this shop.</Sub>
      <StatusBanner
        online={offline.online}
        pending={offline.pending}
        syncing={offline.syncing}
        onSync={offline.syncNow}
      />
      <FlatList
        style={{ marginTop: 12 }}
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={
          <Empty title="No activity yet" hint="Bills and edits will show here." />
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700' }}>
              {item.action || item.type || 'Update'}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {item.user?.name || item.actor || 'Staff'}
              {item.detail ? ` · ${item.detail}` : ''}
            </Text>
            <Text style={{ marginTop: 6, color: colors.muted, fontSize: 12 }}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString('en-IN')
                : ''}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}
