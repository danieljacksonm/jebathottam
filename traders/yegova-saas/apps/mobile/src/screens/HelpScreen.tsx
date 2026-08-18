import { Pressable, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/theme';
import { Card, Screen, Sub, Title } from '../components/ui';

const STEPS = [
  {
    n: '1',
    title: 'Add items',
    text: 'Open Items tab. Add name, price, GST, stock. You can do this with no internet.',
  },
  {
    n: '2',
    title: 'Add customers',
    text: 'More → Customers. Save name, phone, GSTIN, address for udhaar.',
  },
  {
    n: '3',
    title: 'Make a bill',
    text: 'New bill tab. Search item, tap to add, choose cash / UPI / later, save.',
  },
  {
    n: '4',
    title: 'Share the bill',
    text: 'Open a bill → Share. Customer can read it on WhatsApp.',
  },
];

const EXTRA = [
  {
    title: 'Plans',
    text: 'Website is free. Phone online app: one 14-day trial only (cannot restart). Then $1 per month, or pay $5 once for the offline app. After trial ends the phone app locks — no bills until you pay. Android and iOS.',
  },
  {
    title: '$5 offline app',
    text: 'Shop lives only on this phone. Bills, stock, GST, customers, reports. No website. No monthly fee.',
  },
  {
    title: '$1 online app',
    text: 'Online phone app. Syncs with the free website. Team can login on more than one phone.',
  },
  {
    title: 'Quotes and returns',
    text: 'On New bill, pick Quote or Return. Quotes convert later. Returns add stock back.',
  },
  {
    title: 'Stock',
    text: 'More → Stock. Stock in for purchase. Set stock to correct the count.',
  },
  {
    title: 'Reports',
    text: 'Sales, GST by rate, due, expenses. Share CSV. Same as website after sync (online plan).',
  },
];

export function HelpScreen() {
  const navigation = useNavigation();

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
        </Pressable>
        <Title>Help</Title>
        <Sub>Same shop as the website, on this phone.</Sub>
        {STEPS.map((s) => (
          <Card key={s.n}>
            <Text style={{ color: colors.forest, fontWeight: '800' }}>{s.n}</Text>
            <Text style={{ marginTop: 6, fontWeight: '700', fontSize: 16 }}>
              {s.title}
            </Text>
            <Text style={{ marginTop: 6, color: colors.muted, lineHeight: 20 }}>
              {s.text}
            </Text>
          </Card>
        ))}
        {EXTRA.map((s) => (
          <Card key={s.title}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{s.title}</Text>
            <Text style={{ marginTop: 6, color: colors.muted, lineHeight: 20 }}>
              {s.text}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
