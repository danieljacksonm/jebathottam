import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { computeLedger, getCache } from '../lib/repo';
import { colors, money } from '../lib/theme';
import { Card, Empty, Screen, Sub, Title } from '../components/ui';

export function LedgerScreen() {
  const navigation = useNavigation();
  const [rows, setRows] = useState<ReturnType<typeof computeLedger>>([]);

  useFocusEffect(
    useCallback(() => {
      getCache().then((c) => setRows(computeLedger(c)));
    }, []),
  );

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Title>Due list</Title>
      <Sub>Who still has money to pay.</Sub>
      <FlatList
        style={{ marginTop: 12 }}
        data={rows}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Empty title="No dues" hint="Udhaar bills will show here." />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {item.invoiceCount} bills · billed {money(item.billed)}
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontWeight: '700',
                color: item.due > 0 ? colors.danger : colors.ok,
              }}
            >
              Due {money(item.due)}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}
