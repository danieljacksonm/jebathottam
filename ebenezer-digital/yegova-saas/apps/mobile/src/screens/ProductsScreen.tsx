import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useOffline } from '../context/OfflineContext';
import { listProducts, removeProduct, saveProduct } from '../lib/repo';
import { colors, money } from '../lib/theme';
import {
  Card,
  Empty,
  ErrorBox,
  Field,
  Label,
  PrimaryButton,
  Screen,
  StatusBanner,
  Sub,
  Title,
} from '../components/ui';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  gstRate: number;
  unit: string;
  sku?: string | null;
  barcode?: string | null;
  hsn?: string | null;
  category?: string | null;
};

export function ProductsScreen() {
  const offline = useOffline();
  const [items, setItems] = useState<Product[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [gstRate, setGstRate] = useState('0');
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await listProducts());
      await offline.refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load items');
    }
  }, [offline]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function fill(p: Product) {
    setEditId(p.id);
    setName(p.name);
    setPrice(String(p.price));
    setStock(String(p.stock));
    setGstRate(String(p.gstRate));
    setBarcode(p.barcode || '');
  }

  function reset() {
    setEditId(null);
    setName('');
    setPrice('');
    setStock('0');
    setGstRate('0');
    setBarcode('');
  }

  async function onAdd() {
    if (!name.trim() || !price) {
      setError('Name and price needed');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await saveProduct(
        {
          name: name.trim(),
          price: Number(price),
          stock: Number(stock || 0),
          gstRate: Number(gstRate || 0),
          barcode: barcode.trim() || undefined,
          unit: 'NOS',
        },
        editId,
      );
      reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Title>Items</Title>
      <Sub>Add, edit, delete. Saved on phone if offline.</Sub>
      <StatusBanner
        online={offline.online}
        pending={offline.pending}
        syncing={offline.syncing}
        onSync={offline.syncNow}
      />
      <ErrorBox message={error} />

      <Label>Name</Label>
      <Field value={name} onChangeText={setName} placeholder="Product name" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Label>Price</Label>
          <Field
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Label>Stock</Label>
          <Field
            value={stock}
            onChangeText={setStock}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Label>GST %</Label>
          <Field
            value={gstRate}
            onChangeText={setGstRate}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
      <Label>Barcode</Label>
      <Field value={barcode} onChangeText={setBarcode} placeholder="Optional" />
      <PrimaryButton
        title={editId ? 'Update item' : 'Add item'}
        onPress={onAdd}
        loading={loading}
      />

      <FlatList
        style={{ marginTop: 16 }}
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
          <Empty title="No items" hint="Add your first product above." />
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700', color: colors.ink }}>
              {item.name}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {money(item.price)} · GST {item.gstRate}% · Stock {item.stock}{' '}
              {item.unit}
            </Text>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
              <Pressable onPress={() => fill(item)}>
                <Text style={{ color: colors.forest, fontWeight: '700' }}>
                  Edit
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  Alert.alert('Delete item?', item.name, [
                    { text: 'No' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        await removeProduct(item.id);
                        await load();
                      },
                    },
                  ])
                }
              >
                <Text style={{ color: colors.danger, fontWeight: '700' }}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
