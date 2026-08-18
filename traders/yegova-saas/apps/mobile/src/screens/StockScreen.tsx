import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listProducts, listStock, stockAdjust, stockIn } from '../lib/repo';
import { colors } from '../lib/theme';
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

export function StockScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [mode, setMode] = useState<'in' | 'adjust'>('in');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [p, h] = await Promise.all([listProducts(), listStock()]);
    setProducts(p);
    setHistory(h);
    if (!productId && p[0]) setProductId(p[0].id);
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      load().catch((e) => setError(e.message));
    }, [load]),
  );

  async function save() {
    setError('');
    try {
      if (mode === 'in') {
        await stockIn({ productId, qty: Number(qty), note });
      } else {
        await stockAdjust({ productId, stock: Number(qty), note });
      }
      setQty('1');
      setNote('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save stock');
    }
  }

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Title>Stock</Title>
      <Sub>Add purchase or set quantity. Works offline.</Sub>
      <ErrorBox message={error} />
      <Label>Item</Label>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setProductId(item.id)}
            style={{
              marginRight: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor:
                productId === item.id ? colors.forest : colors.white,
            }}
          >
            <Text
              style={{
                color: productId === item.id ? colors.paper : colors.ink,
                fontWeight: '600',
              }}
            >
              {item.name} ({item.stock})
            </Text>
          </Pressable>
        )}
      />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <Pressable onPress={() => setMode('in')}>
          <Text style={{ fontWeight: '700', color: mode === 'in' ? colors.forest : colors.muted }}>
            Stock in
          </Text>
        </Pressable>
        <Pressable onPress={() => setMode('adjust')}>
          <Text style={{ fontWeight: '700', color: mode === 'adjust' ? colors.forest : colors.muted }}>
            Set stock
          </Text>
        </Pressable>
      </View>
      <Label>{mode === 'in' ? 'Qty in' : 'New qty'}</Label>
      <Field value={qty} onChangeText={setQty} keyboardType="decimal-pad" />
      <Label>Note</Label>
      <Field value={note} onChangeText={setNote} placeholder="Supplier bill / reason" />
      <PrimaryButton title="Save stock" onPress={save} />
      <FlatList
        style={{ marginTop: 16 }}
        data={history}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Empty title="No movements" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700' }}>
              {item.product?.name || 'Item'} · {item.type}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {item.qty} · {new Date(item.createdAt).toLocaleString('en-IN')}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}
