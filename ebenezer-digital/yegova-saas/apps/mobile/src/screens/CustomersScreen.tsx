import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useOffline } from '../context/OfflineContext';
import { listCustomers, removeCustomer, saveCustomer } from '../lib/repo';
import { colors } from '../lib/theme';
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

type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  gstin?: string | null;
  address?: string | null;
};

export function CustomersScreen() {
  const navigation = useNavigation();
  const offline = useOffline();
  const [items, setItems] = useState<Customer[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await listCustomers());
      await offline.refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load customers');
    }
  }, [offline]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function reset() {
    setEditId(null);
    setName('');
    setPhone('');
    setGstin('');
    setAddress('');
  }

  async function onAdd() {
    if (!name.trim()) {
      setError('Name needed');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await saveCustomer(
        {
          name: name.trim(),
          phone: phone.trim() || undefined,
          gstin: gstin.trim() || undefined,
          address: address.trim() || undefined,
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
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 4 }}>
        <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Title>Customers</Title>
      <Sub>Add, edit, delete. Works offline.</Sub>
      <StatusBanner
        online={offline.online}
        pending={offline.pending}
        syncing={offline.syncing}
        onSync={offline.syncNow}
      />
      <ErrorBox message={error} />

      <Label>Name</Label>
      <Field value={name} onChangeText={setName} placeholder="Customer name" />
      <Label>Phone</Label>
      <Field
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Phone"
      />
      <Label>GSTIN</Label>
      <Field value={gstin} onChangeText={setGstin} placeholder="Optional" />
      <Label>Address</Label>
      <Field value={address} onChangeText={setAddress} placeholder="Optional" />
      <PrimaryButton
        title={editId ? 'Update customer' : 'Add customer'}
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
          <Empty title="No customers" hint="Add a customer for udhaar bills." />
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700', color: colors.ink }}>
              {item.name}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {[item.phone, item.gstin, item.address]
                .filter(Boolean)
                .join(' · ') || 'No phone / GSTIN'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
              <Pressable
                onPress={() => {
                  setEditId(item.id);
                  setName(item.name);
                  setPhone(item.phone || '');
                  setGstin(item.gstin || '');
                  setAddress(item.address || '');
                }}
              >
                <Text style={{ color: colors.forest, fontWeight: '700' }}>
                  Edit
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  Alert.alert('Delete customer?', item.name, [
                    { text: 'No' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        await removeCustomer(item.id);
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
