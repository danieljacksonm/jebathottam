import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getBill, getShop } from '../lib/repo';
import { colors, money } from '../lib/theme';
import {
  Card,
  ErrorBox,
  PrimaryButton,
  Screen,
  Sub,
  Title,
} from '../components/ui';
import { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'BillDetail'>;

function billText(shop: any, bill: any) {
  const lines = (bill.items || [])
    .map(
      (i: any) =>
        `${i.name}  ${i.qty} x ${money(i.price)}  = ${money(i.lineTotal ?? i.qty * i.price)}`,
    )
    .join('\n');
  return [
    shop?.name || 'Ebenezer',
    shop?.gstin ? `GSTIN ${shop.gstin}` : '',
    shop?.phone ? `Ph ${shop.phone}` : '',
    '',
    bill.invoiceLabel,
    new Date(bill.billDate || bill.createdAt).toLocaleString('en-IN'),
    bill.customer?.name ? `To: ${bill.customer.name}` : 'Walk-in',
    '',
    lines,
    '',
    `Subtotal ${money(bill.subtotal)}`,
    `Tax ${money(bill.taxTotal)}`,
    bill.discount ? `Discount ${money(bill.discount)}` : '',
    `TOTAL ${money(bill.grandTotal)}`,
    `Paid ${money(bill.paidAmount)} · ${bill.paymentMode || ''} · ${bill.status}`,
    bill.notes ? `\n${bill.notes}` : '',
    '',
    'Thank you',
  ]
    .filter((x) => x !== '')
    .join('\n');
}

export function BillDetailScreen({ navigation, route }: Props) {
  const [bill, setBill] = useState<any | null>(null);
  const [shop, setShop] = useState<any | null>(null);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      Promise.all([getBill(route.params.id), getShop()])
        .then(([b, s]) => {
          setBill(b);
          setShop(s);
        })
        .catch((e) => setError(e instanceof Error ? e.message : 'Not found'));
    }, [route.params.id]),
  );

  async function share() {
    if (!bill) return;
    await Share.share({
      title: bill.invoiceLabel,
      message: billText(shop, bill),
    });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
        </Pressable>
        <Title>{bill?.invoiceLabel || 'Bill'}</Title>
        <Sub>
          {bill?.customer?.name || 'Walk-in'} · {bill?.status || ''}
        </Sub>
        <ErrorBox message={error} />
        {bill ? (
          <>
            {(bill.items || []).map((item: any, i: number) => (
              <Card key={`${item.productId || item.name}-${i}`}>
                <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                <Text style={{ marginTop: 4, color: colors.muted }}>
                  {item.qty} × {money(item.price)} · GST {item.gstRate || 0}%
                </Text>
                <Text style={{ marginTop: 8, fontWeight: '700' }}>
                  {money(item.lineTotal ?? item.qty * item.price)}
                </Text>
              </Card>
            ))}
            <Card>
              <Row label="Before tax" value={money(bill.subtotal)} />
              <Row label="Tax" value={money(bill.taxTotal)} />
              {bill.discount ? (
                <Row label="Discount" value={money(bill.discount)} />
              ) : null}
              <Row label="TOTAL" value={money(bill.grandTotal)} bold />
              <Row label="Paid" value={money(bill.paidAmount)} />
            </Card>
            <PrimaryButton title="Share / print text" onPress={share} />
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: bold ? colors.ink : colors.muted,
          fontWeight: bold ? '700' : '500',
        }}
      >
        {label}
      </Text>
      <Text style={{ fontWeight: bold ? '700' : '600' }}>{value}</Text>
    </View>
  );
}
