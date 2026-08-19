import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLicense } from '../context/LicenseContext';
import { assertCanUseApp } from '../lib/license';
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
import { colors } from '../lib/theme';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const license = useLicense();
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError('');
    setLoading(true);
    try {
      if (!license.active && !license.cloudDisabled) {
        throw new Error(
          'Start the 14-day phone trial or pay first, then create your shop login.',
        );
      }
      await assertCanUseApp();
      await register({
        name: name.trim(),
        shopName: shopName.trim(),
        email: email.trim(),
        password,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create shop');
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
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <BrandTitle />
          <Title>Create free website shop</Title>
          <Sub>
            Website is free. This login also works with the paid phone app
            (14-day app trial, then $1 / month).
          </Sub>

          <Label>Your name</Label>
          <Field value={name} onChangeText={setName} placeholder="Your name" />
          <Label>Shop name</Label>
          <Field
            value={shopName}
            onChangeText={setShopName}
            placeholder="Your shop name"
          />
          <Label>Email</Label>
          <Field
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@shop.com"
          />
          <Label>Password</Label>
          <Field
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
          />
          <ErrorBox message={error} />
          <PrimaryButton
            title="Create free shop"
            onPress={onSubmit}
            loading={loading}
          />
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{
              marginTop: 22,
              textAlign: 'center',
              color: colors.forest,
              fontWeight: '600',
            }}
          >
            Already have account? Sign in
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
