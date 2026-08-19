import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { addStaff, listTeam, removeStaff, updateStaffRole } from '../lib/repo';
import { useOffline } from '../context/OfflineContext';
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

const ROLES = ['owner', 'manager', 'cashier'] as const;

export function TeamScreen() {
  const navigation = useNavigation();
  const offline = useOffline();
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cashier');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setItems(await listTeam());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch((e) => setError(e.message));
    }, [load]),
  );

  async function add() {
    setError('');
    try {
      await addStaff({ name, email, password, role });
      setName('');
      setEmail('');
      setPassword('');
      setRole('cashier');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add staff');
    }
  }

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Title>Team</Title>
      <Sub>
        {offline.localOnly
          ? 'This $5 app is one phone. Staff logins (cashier on another phone) need the $1 online plan.'
          : 'Owner, manager, cashier. Adding staff needs internet.'}
      </Sub>
      <StatusBanner
        online={offline.online}
        pending={offline.pending}
        syncing={offline.syncing}
        onSync={offline.syncNow}
      />
      <ErrorBox message={error} />
      <Label>Name</Label>
      <Field value={name} onChangeText={setName} placeholder="Staff name" />
      <Label>Email</Label>
      <Field
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Label>Password</Label>
      <Field value={password} onChangeText={setPassword} secureTextEntry />
      <Label>Role</Label>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
        {ROLES.map((r) => (
          <Pressable key={r} onPress={() => setRole(r)}>
            <Text
              style={{
                fontWeight: '700',
                color: role === r ? colors.forest : colors.muted,
                textTransform: 'capitalize',
              }}
            >
              {r}
            </Text>
          </Pressable>
        ))}
      </View>
      <PrimaryButton title="Add staff" onPress={add} />
      <FlatList
        style={{ marginTop: 16 }}
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Empty title="Only you" hint="Add cashier when online." />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '700' }}>
              {item.user?.name || item.name || 'Staff'}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {item.user?.email || item.email} · {item.role}
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
              {ROLES.filter((r) => r !== item.role).map((r) => (
                <Pressable
                  key={r}
                  onPress={async () => {
                    try {
                      await updateStaffRole(item.id, r);
                      await load();
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'Could not change role');
                    }
                  }}
                >
                  <Text style={{ color: colors.forest, fontWeight: '700' }}>
                    Make {r}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() =>
                  Alert.alert('Remove staff?', item.user?.name || 'Staff', [
                    { text: 'No' },
                    {
                      text: 'Remove',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await removeStaff(item.id);
                          await load();
                        } catch (e) {
                          setError(
                            e instanceof Error ? e.message : 'Could not remove',
                          );
                        }
                      },
                    },
                  ])
                }
              >
                <Text style={{ color: colors.danger, fontWeight: '700' }}>
                  Remove
                </Text>
              </Pressable>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
