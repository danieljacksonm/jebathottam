import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listExpenses, removeExpense, saveExpense } from '../lib/repo';
import { colors, money } from '../lib/theme';
import {
  Card,
  Empty,
  ErrorBox,
  Field,
  Label,
  PrimaryButton,
  Screen,
  Sub,
  Title,
} from '../components/ui';

export function ExpensesScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setItems(await listExpenses());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch((e) => setError(e.message));
    }, [load]),
  );

  async function add() {
    if (!title.trim() || !amount) {
      setError('Title and amount needed');
      return;
    }
    setError('');
    await saveExpense({
      title: title.trim(),
      amount: Number(amount),
      category,
      paymentMode: 'cash',
    });
    setTitle('');
    setAmount('');
    await load();
  }

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Title>Expenses</Title>
      <Sub>Shop costs. Saved offline too.</Sub>
      <ErrorBox message={error} />
      <Label>Title</Label>
      <Field value={title} onChangeText={setTitle} placeholder="Rent, petrol…" />
      <Label>Amount</Label>
      <Field value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <Label>Category</Label>
      <Field value={category} onChangeText={setCategory} />
      <PrimaryButton title="Add expense" onPress={add} />
      <FlatList
        style={{ marginTop: 16 }}
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Empty title="No expenses" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {item.category} · {money(item.amount)}
            </Text>
            <Pressable
              onPress={() =>
                Alert.alert('Delete?', item.title, [
                  { text: 'No' },
                  {
                    text: 'Delete',
                    onPress: async () => {
                      await removeExpense(item.id);
                      await load();
                    },
                  },
                ])
              }
            >
              <Text style={{ marginTop: 8, color: colors.danger, fontWeight: '700' }}>
                Delete
              </Text>
            </Pressable>
          </Card>
        )}
      />
    </Screen>
  );
}
