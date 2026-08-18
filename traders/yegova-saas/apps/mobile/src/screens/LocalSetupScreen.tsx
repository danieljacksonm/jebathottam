import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import {
  BrandTitle,
  ErrorBox,
  Field,
  Label,
  PrimaryButton,
  Screen,
  Sub,
  Title,
} from '../components/ui';

export function LocalSetupScreen() {
  const { enterLocalShop } = useAuth();
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!shopName.trim()) {
      setError('Please type shop name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await enterLocalShop({ shopName, ownerName, gstin });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open shop');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <BrandTitle />
          <Title>Your phone shop</Title>
          <Sub>
            $5 paid. This shop stays on this phone only. No website. No
            internet needed after this.
          </Sub>
          <Label>Shop name</Label>
          <Field
            value={shopName}
            onChangeText={setShopName}
            placeholder="Sri Store"
          />
          <Label>Your name</Label>
          <Field
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Owner"
          />
          <Label>GSTIN (optional)</Label>
          <Field
            value={gstin}
            onChangeText={setGstin}
            autoCapitalize="characters"
            placeholder="33AAAAA0000A1Z5"
          />
          <ErrorBox message={error} />
          <PrimaryButton title="Open shop" onPress={save} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
