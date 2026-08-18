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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const license = useLicense();
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
          'Phone app is locked. Start trial or pay first, then sign in.',
        );
      }
      await assertCanUseApp();
      await signIn(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
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
          <Title>Welcome back</Title>
          <Sub>Sign in to your shop billing on phone.</Sub>

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
          <PrimaryButton title="Sign in" onPress={onSubmit} loading={loading} />
          <Text
            onPress={() => navigation.navigate('Paywall')}
            style={{
              marginTop: 22,
              textAlign: 'center',
              color: colors.forest,
              fontWeight: '600',
            }}
          >
            See plans · free website, $1 app, $5 offline
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
