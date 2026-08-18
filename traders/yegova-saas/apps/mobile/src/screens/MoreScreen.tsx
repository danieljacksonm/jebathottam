import { Pressable, ScrollView, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { API_URL } from '../lib/api';
import { colors } from '../lib/theme';
import {
  BrandTitle,
  Card,
  GhostButton,
  Screen,
  StatusBanner,
  Sub,
  Title,
} from '../components/ui';
import { MoreStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreHome'>;

const LINKS: Array<{ id: keyof MoreStackParamList; label: string; hint: string }> = [
  { id: 'Customers', label: 'Customers', hint: 'Name, phone, GSTIN, address' },
  { id: 'Quotes', label: 'Quotes', hint: 'Estimates → convert to bill' },
  { id: 'Ledger', label: 'Due list', hint: 'Who still has to pay' },
  { id: 'Stock', label: 'Stock', hint: 'Purchase in / set qty' },
  { id: 'Expenses', label: 'Expenses', hint: 'Rent, petrol, salary' },
  { id: 'Reports', label: 'Reports', hint: 'Sales, GST, day book' },
  { id: 'Team', label: 'Team', hint: 'Owner / manager / cashier' },
  { id: 'Activity', label: 'Activity', hint: 'Who did what' },
  { id: 'Settings', label: 'Shop settings', hint: 'GSTIN, bank, prefixes' },
  { id: 'Help', label: 'Help', hint: 'How to use' },
];

export function MoreScreen({ navigation }: Props) {
  const { user, shop, signOut } = useAuth();
  const offline = useOffline();

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <BrandTitle />
        <Title>More</Title>
        <Sub>
          {offline.localOnly
            ? 'Full shop on this phone. No website connection.'
            : 'All website features, on this phone.'}
        </Sub>
        <StatusBanner
          online={offline.online}
          pending={offline.pending}
          syncing={offline.syncing}
          onSync={offline.syncNow}
        />

        <Card>
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>
            SIGNED IN
          </Text>
          <Text style={{ marginTop: 8, fontSize: 18, fontWeight: '700' }}>
            {user?.name}
          </Text>
          <Text style={{ marginTop: 4, color: colors.muted }}>{user?.email}</Text>
          <Text style={{ marginTop: 10, color: colors.forest, fontWeight: '600' }}>
            {shop?.name} · {user?.role || 'owner'}
            {shop?.plan ? ` · ${shop.plan}` : ''}
          </Text>
        </Card>

        {LINKS.map((link) => (
          <Pressable
            key={link.id}
            onPress={() => navigation.navigate(link.id as never)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: colors.line,
              padding: 16,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: '700', color: colors.ink }}>
              {link.label}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>{link.hint}</Text>
          </Pressable>
        ))}

        {offline.localOnly ? null : (
          <GhostButton title="Sign out" onPress={() => signOut()} />
        )}

        <Card>
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>
            {offline.localOnly ? 'OFFLINE APP' : 'API'}
          </Text>
          <Text style={{ marginTop: 8, color: colors.ink }}>
            {offline.localOnly
              ? '$5 lifetime · this phone only · website is not used'
              : API_URL}
          </Text>
          <Text style={{ marginTop: 8, color: colors.muted, fontSize: 13 }}>
            {offline.localOnly
              ? 'Bills, stock, GST, customers, reports — all stay here. No cloud.'
              : 'Website is free. $1 / month is only for this online phone app. Tap the green bar to sync.'}
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
