import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getCache, getShop, saveShop } from '../lib/repo';
import { useOffline } from '../context/OfflineContext';
import { colors } from '../lib/theme';
import {
  ErrorBox,
  Field,
  Label,
  PrimaryButton,
  Screen,
  StatusBanner,
  Sub,
  Title,
} from '../components/ui';

export function SettingsScreen() {
  const navigation = useNavigation();
  const offline = useOffline();
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [gpayPhone, setGpayPhone] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [quotePrefix, setQuotePrefix] = useState('QT');
  const [lowStockAt, setLowStockAt] = useState('10');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getShop()
        .then((shop) => {
          if (!shop) return;
          setName(shop.name || '');
          setGstin(shop.gstin || '');
          setPhone(shop.phone || '');
          setAddress(shop.address || '');
          setBankAccount(shop.bankAccount || '');
          setBankIfsc(shop.bankIfsc || '');
          setGpayPhone(shop.gpayPhone || '');
          setInvoicePrefix(shop.invoicePrefix || 'INV');
          setQuotePrefix(shop.quotePrefix || 'QT');
          setLowStockAt(String(shop.lowStockAt ?? 10));
        })
        .catch((e) => setError(e.message));
    }, []),
  );

  async function save() {
    setSaving(true);
    setError('');
    try {
      await saveShop({
        name,
        gstin,
        phone,
        address,
        bankAccount,
        bankIfsc,
        gpayPhone,
        invoicePrefix,
        quotePrefix,
        lowStockAt: Number(lowStockAt || 10),
      });
      Alert.alert(
        'Saved',
        offline.online
          ? 'Shop settings updated.'
          : 'Saved on this phone. Will sync when online.',
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  }

  async function backup() {
    const cache = await getCache();
    await Share.share({
      title: 'Ebenezer shop backup',
      message: JSON.stringify(
        {
          shop: cache.shop,
          products: cache.products,
          customers: cache.customers,
          bills: cache.bills,
          quotes: cache.quotes,
          expenses: cache.expenses,
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.forest, fontWeight: '600' }}>← Back</Text>
        </Pressable>
        <Title>Shop settings</Title>
        <Sub>GSTIN, bank, bill prefix. Works offline.</Sub>
        <StatusBanner
          online={offline.online}
          pending={offline.pending}
          syncing={offline.syncing}
          onSync={offline.syncNow}
        />
        <ErrorBox message={error} />
        <Label>Shop name</Label>
        <Field value={name} onChangeText={setName} />
        <Label>GSTIN</Label>
        <Field value={gstin} onChangeText={setGstin} autoCapitalize="characters" />
        <Label>Phone</Label>
        <Field value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Label>Address</Label>
        <Field value={address} onChangeText={setAddress} />
        <Label>Bank account</Label>
        <Field value={bankAccount} onChangeText={setBankAccount} />
        <Label>IFSC</Label>
        <Field value={bankIfsc} onChangeText={setBankIfsc} autoCapitalize="characters" />
        <Label>GPay / UPI phone</Label>
        <Field value={gpayPhone} onChangeText={setGpayPhone} keyboardType="phone-pad" />
        <Label>Invoice prefix</Label>
        <Field value={invoicePrefix} onChangeText={setInvoicePrefix} />
        <Label>Quote prefix</Label>
        <Field value={quotePrefix} onChangeText={setQuotePrefix} />
        <Label>Low stock at</Label>
        <Field
          value={lowStockAt}
          onChangeText={setLowStockAt}
          keyboardType="number-pad"
        />
        <PrimaryButton title="Save settings" onPress={save} loading={saving} />
        <Pressable onPress={backup} style={{ marginTop: 18, alignItems: 'center' }}>
          <Text style={{ color: colors.forest, fontWeight: '700' }}>
            Share shop backup (JSON)
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
