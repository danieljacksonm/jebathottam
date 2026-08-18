import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBill, listCustomers, listProducts } from '../lib/repo';
import { useOffline } from '../context/OfflineContext';
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
};

type Customer = { id: string; name: string };

type Line = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  gstRate: number;
  unit: string;
};

export function NewBillScreen() {
  const offline = useOffline();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [docType, setDocType] = useState<'invoice' | 'quote' | 'credit_note'>(
    'invoice',
  );
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      const [p, c] = await Promise.all([listProducts(), listCustomers()]);
      setProducts(p);
      setCustomers(c);
      await offline.refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load');
    }
  }, [offline]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 40);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku || '').toLowerCase().includes(q) ||
          (p.barcode || '').toLowerCase().includes(q),
      )
      .slice(0, 40);
  }, [products, query]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;
    for (const line of lines) {
      const base = line.qty * line.price;
      subtotal += base;
      tax += (base * line.gstRate) / 100;
    }
    const disc = Number(discount || 0);
    const grand = Math.round(Math.max(0, subtotal + tax - disc));
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      discount: disc,
      grand,
    };
  }, [lines, discount]);

  function addProduct(product: Product) {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          qty: 1,
          price: product.price,
          gstRate: product.gstRate,
          unit: product.unit || 'NOS',
        },
      ];
    });
    setQuery('');
  }

  function changeQty(productId: string, delta: number) {
    setLines((prev) =>
      prev
        .map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + delta } : l,
        )
        .filter((l) => l.qty > 0),
    );
  }

  async function saveBill() {
    if (!lines.length) {
      setError('Please add at least 1 item');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const bill = await createBill({
            customerId: customerId || undefined,
            paymentMode: docType === 'invoice' ? paymentMode : 'credit',
            paidAmount:
              docType === 'invoice' && paymentMode !== 'credit'
                ? totals.grand
                : 0,
            discount: totals.discount || 0,
            notes: notes.trim() || undefined,
            docType,
            items: lines.map((l) => ({
              productId: l.productId,
              name: l.name,
              qty: l.qty,
              price: l.price,
              gstRate: l.gstRate,
            })),
          });
      setLines([]);
      setCustomerId('');
      setPaymentMode('cash');
      setDiscount('');
      setNotes('');
      Alert.alert(
        docType === 'quote'
          ? 'Quote saved'
          : docType === 'credit_note'
            ? 'Return saved'
            : 'Bill saved',
        `${bill.invoiceLabel} · ${money(bill.grandTotal)}${
          offline.online ? '' : '\nSaved on this phone. Will sync when online.'
        }`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save bill');
    } finally {
      setLoading(false);
    }
  }

  const modes = [
    { id: 'cash', label: 'Cash' },
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'credit', label: 'Later' },
  ];

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <Title>
          {docType === 'quote'
            ? 'New quote'
            : docType === 'credit_note'
              ? 'Return'
              : 'New bill'}
        </Title>
        <Sub>Search item, tap to add, then save. Works offline.</Sub>
        <StatusBanner
          online={offline.online}
          pending={offline.pending}
          syncing={offline.syncing}
          onSync={offline.syncNow}
        />
        <ErrorBox message={error} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {(
            [
              ['invoice', 'Bill'],
              ['quote', 'Quote'],
              ['credit_note', 'Return'],
            ] as const
          ).map(([id, label]) => (
            <Pressable
              key={id}
              onPress={() => setDocType(id)}
              style={[chip, docType === id && chipActive]}
            >
              <Text style={[chipText, docType === id && chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Label>Search item</Label>
        <Field
          value={query}
          onChangeText={setQuery}
          placeholder="Name or barcode"
          autoCorrect={false}
        />
      </View>

      <FlatList
        style={{ marginTop: 8, maxHeight: 180 }}
        data={filtered}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 20 }}>
            <Empty
              title="No items"
              hint="Add products first from the Items tab."
            />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => addProduct(item)}
            style={{
              marginHorizontal: 20,
              marginBottom: 8,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.line,
              backgroundColor: colors.surface,
              padding: 14,
            }}
          >
            <Text style={{ fontWeight: '700', color: colors.ink }}>
              {item.name}
            </Text>
            <Text style={{ marginTop: 4, color: colors.muted }}>
              {money(item.price)} · Stock {item.stock} {item.unit}
            </Text>
          </Pressable>
        )}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
          This bill
        </Text>
        {lines.length === 0 ? (
          <Empty title="Cart empty" hint="Tap an item above to add." />
        ) : (
          lines.map((line) => (
            <Card key={line.productId}>
              <Text style={{ fontWeight: '700' }}>{line.name}</Text>
              <Text style={{ marginTop: 4, color: colors.muted }}>
                {money(line.price)} · GST {line.gstRate}%
              </Text>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable
                    onPress={() => changeQty(line.productId, -1)}
                    style={qtyBtn}
                  >
                    <Text style={qtyText}>−</Text>
                  </Pressable>
                  <Text style={{ fontSize: 18, fontWeight: '700', minWidth: 28, textAlign: 'center' }}>
                    {line.qty}
                  </Text>
                  <Pressable
                    onPress={() => changeQty(line.productId, 1)}
                    style={qtyBtn}
                  >
                    <Text style={qtyText}>+</Text>
                  </Pressable>
                </View>
                <Text style={{ fontWeight: '700' }}>
                  {money(line.qty * line.price * (1 + line.gstRate / 100))}
                </Text>
              </View>
            </Card>
          ))
        )}

        <Label>Customer</Label>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            onPress={() => setCustomerId('')}
            style={[chip, !customerId && chipActive]}
          >
            <Text style={[chipText, !customerId && chipTextActive]}>
              Walk-in
            </Text>
          </Pressable>
          {customers.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCustomerId(c.id)}
              style={[chip, customerId === c.id && chipActive]}
            >
              <Text
                style={[
                  chipText,
                  customerId === c.id && chipTextActive,
                ]}
              >
                {c.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Label>Payment</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {modes.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setPaymentMode(m.id)}
              style={[chip, paymentMode === m.id && chipActive]}
            >
              <Text
                style={[chipText, paymentMode === m.id && chipTextActive]}
              >
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Label>Discount (Rs)</Label>
        <Field
          value={discount}
          onChangeText={setDiscount}
          keyboardType="decimal-pad"
          placeholder="0"
        />
        <Label>Notes</Label>
        <Field
          value={notes}
          onChangeText={setNotes}
          placeholder="Thanks / due date"
        />

        <Card>
          <Row label="Before tax" value={money(totals.subtotal)} />
          <Row label="Tax" value={money(totals.tax)} />
          {totals.discount ? (
            <Row label="Discount" value={money(totals.discount)} />
          ) : null}
          <Row label="TOTAL" value={money(totals.grand)} bold />
        </Card>

        <PrimaryButton
          title={
            docType === 'quote'
              ? 'SAVE QUOTE'
              : docType === 'credit_note'
                ? 'SAVE RETURN'
                : 'SAVE BILL'
          }
          onPress={saveBill}
          loading={loading}
          disabled={!lines.length}
        />
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
          fontSize: bold ? 16 : 14,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: colors.ink,
          fontWeight: bold ? '700' : '600',
          fontSize: bold ? 16 : 14,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const qtyBtn = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: colors.forest,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const qtyText = {
  color: colors.paper,
  fontSize: 20,
  fontWeight: '700' as const,
  lineHeight: 22,
};

const chip = {
  borderRadius: 999,
  borderWidth: 1,
  borderColor: colors.line,
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginRight: 8,
  backgroundColor: colors.white,
};

const chipActive = {
  backgroundColor: colors.forest,
  borderColor: colors.forest,
};

const chipText = {
  color: colors.ink,
  fontWeight: '600' as const,
};

const chipTextActive = {
  color: colors.paper,
};
