import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useLicense } from '../context/LicenseContext';
import { OFFLINE_USD, ONLINE_USD, TRIAL_DAYS } from '../lib/license';
import { colors } from '../lib/theme';
import {
  BrandTitle,
  Card,
  ErrorBox,
  PrimaryButton,
  Screen,
  Sub,
  Title,
} from '../components/ui';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Paywall'>;

export function PaywallScreen({ navigation }: Props) {
  const license = useLicense();
  const { token, signOut } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'trial' | 'online' | 'offline' | ''>('');

  const expired = !license.active && !license.cloudDisabled;
  const trialUsed =
    !!license.license.trialUsed ||
    license.license.kind === 'trial' ||
    license.trialExpired;
  const canStartTrial = !trialUsed && license.license.kind === 'none';

  async function startTrial() {
    setError('');
    setBusy('trial');
    try {
      await license.startTrial();
      if (!token) navigation.navigate('Register');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start trial');
    } finally {
      setBusy('');
    }
  }

  async function online() {
    setError('');
    setBusy('online');
    try {
      await license.buyOnline();
      if (!token) navigation.navigate('Login');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    } finally {
      setBusy('');
    }
  }

  async function offline() {
    setError('');
    setBusy('offline');
    try {
      await license.buyOffline();
      navigation.navigate('LocalSetup');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}>
        <BrandTitle />
        <Title>
          {license.trialExpired || (expired && trialUsed)
            ? 'Trial locked'
            : 'Choose the phone app'}
        </Title>
        <Sub>
          {license.trialExpired || (expired && trialUsed)
            ? `Your ${TRIAL_DAYS}-day phone trial is over. The website stays free. To use this phone app again, pay $${ONLINE_USD} / month or buy the $${OFFLINE_USD} offline app.`
            : 'The website is free. You only pay for the phone app. Same GST features as costly software.'}
        </Sub>
        <ErrorBox message={error} />

        {(license.trialExpired || (expired && trialUsed)) && (
          <Card>
            <Text style={{ color: colors.danger, fontWeight: '800' }}>
              LOCKED
            </Text>
            <Text style={{ marginTop: 8, color: colors.muted, lineHeight: 20 }}>
              Bills, items, stock and reports are blocked on this phone until you
              pay. Free trial cannot start again on this device.
            </Text>
          </Card>
        )}

        {canStartTrial ? (
          <Card>
            <Text style={{ color: colors.brass, fontWeight: '800', fontSize: 12 }}>
              TRIAL · ONE TIME
            </Text>
            <Text style={{ marginTop: 8, fontSize: 22, fontWeight: '700' }}>
              {TRIAL_DAYS} days only
            </Text>
            <Text style={{ marginTop: 8, color: colors.muted, lineHeight: 20 }}>
              One free trial per phone. After {TRIAL_DAYS} days the app locks
              until you pay. Cannot restart trial by signing out.
            </Text>
            <PrimaryButton
              title={busy === 'trial' ? 'Opening…' : 'Start 14-day app trial'}
              onPress={startTrial}
              loading={busy === 'trial'}
            />
          </Card>
        ) : null}

        <Card>
          <Text style={{ color: colors.forest, fontWeight: '800', fontSize: 12 }}>
            ONLINE APP
          </Text>
          <Text style={{ marginTop: 8, fontSize: 22, fontWeight: '700' }}>
            ${ONLINE_USD} / month
          </Text>
          <Text style={{ marginTop: 8, color: colors.muted, lineHeight: 20 }}>
            Unlock online phone app. Syncs with the free website. Android and iOS.
          </Text>
          <PrimaryButton
            title={busy === 'online' ? 'Paying…' : `Pay $${ONLINE_USD} / month`}
            onPress={online}
            loading={busy === 'online'}
          />
        </Card>

        <Card>
          <Text style={{ color: colors.ink, fontWeight: '800', fontSize: 12 }}>
            OFFLINE APP · ONCE
          </Text>
          <Text style={{ marginTop: 8, fontSize: 22, fontWeight: '700' }}>
            ${OFFLINE_USD} lifetime
          </Text>
          <Text style={{ marginTop: 8, color: colors.muted, lineHeight: 20 }}>
            Pay once. Full shop on this phone. After download it never talks to
            the website. No monthly fee.
          </Text>
          <PrimaryButton
            title={
              busy === 'offline'
                ? 'Paying…'
                : `Buy offline app · $${OFFLINE_USD}`
            }
            onPress={offline}
            loading={busy === 'offline'}
          />
        </Card>

        <View style={{ marginTop: 8, gap: 14 }}>
          {canStartTrial || license.active ? (
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.forest,
                  fontWeight: '700',
                }}
              >
                Already have online login?
              </Text>
            </Pressable>
          ) : null}
          {token ? (
            <Pressable
              onPress={() => signOut()}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.muted,
                  fontWeight: '600',
                }}
              >
                Sign out (website still free)
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
