import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { computeReports, getCache } from '../lib/repo';
import { useOffline } from '../context/OfflineContext';
import { colors, money } from '../lib/theme';
import { Card, PrimaryButton, Screen, StatusBanner, Sub, Title } from '../components/ui';

function monthStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ReportsScreen() {
  const navigation = useNavigation();
  const offline = useOffline();
  const [from] = useState(monthStart());
  const [to] = useState(today());
  const [data, setData] = useState<ReturnType<typeof computeReports> | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      getCache().then((c) => setData(computeReports(c, from, to)));
    }, [from, to]),
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
        </Pressable>
        <Title>Reports</Title>
        <Sub>
          {from} → {to} · from phone copy (syncs when online)
        </Sub>
        <StatusBanner
          online={offline.online}
          pending={offline.pending}
          syncing={offline.syncing}
          onSync={offline.syncNow}
        />
        <PrimaryButton
          title="Share GST / sales CSV"
          onPress={async () => {
            if (!data) return;
            const rows = [
              ['From', from, 'To', to],
              ['Bills', String(data.summary.invoiceCount)],
              ['Sales', String(data.summary.totalSales)],
              ['Tax', String(data.summary.totalTax)],
              ['Paid', String(data.summary.totalPaid)],
              ['Due', String(data.summary.outstanding)],
              ['Expenses', String(data.summary.totalExpense)],
              [],
              ['GST %', 'Taxable', 'Tax'],
              ...data.gstRows.map((r) => [
                String(r.gstRate),
                String(r.taxable),
                String(r.tax),
              ]),
            ];
            await Share.share({
              title: 'Ebenezer report',
              message: rows.map((r) => r.join(',')).join('\n'),
            });
          }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <Stat label="Bills" value={String(data?.summary.invoiceCount || 0)} />
          <Stat label="Sales" value={money(data?.summary.totalSales || 0)} />
          <Stat label="Collected" value={money(data?.summary.totalPaid || 0)} />
          <Stat label="Due" value={money(data?.summary.outstanding || 0)} />
          <Stat label="Tax" value={money(data?.summary.totalTax || 0)} />
          <Stat label="Expenses" value={money(data?.summary.totalExpense || 0)} />
        </View>
        <Text style={{ marginTop: 20, fontSize: 18, fontWeight: '700' }}>
          GST by rate
        </Text>
        {(data?.gstRows || []).map((r) => (
          <Card key={r.gstRate}>
            <Text style={{ fontWeight: '700' }}>{r.gstRate}%</Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              Taxable {money(r.taxable)} · Tax {money(r.tax)}
            </Text>
          </Card>
        ))}
        <Text style={{ marginTop: 20, fontSize: 18, fontWeight: '700' }}>
          Day book
        </Text>
        {(data?.bills || []).slice(0, 40).map((b) => (
          <Card key={b.id}>
            <Text style={{ fontWeight: '700' }}>{b.invoiceLabel}</Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {b.customer?.name || 'Walk-in'} · {money(b.grandTotal)} · {b.status}
            </Text>
          </Card>
        ))}
        {(data?.expenses || []).slice(0, 20).map((e) => (
          <Card key={e.id}>
            <Text style={{ fontWeight: '700' }}>Expense · {e.title}</Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {e.category} · {money(e.amount)}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        width: '47%',
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.line,
        padding: 14,
      }}
    >
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
      <Text style={{ marginTop: 6, fontSize: 18, fontWeight: '700' }}>
        {value}
      </Text>
    </View>
  );
}
