import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../lib/theme';
import { useOffline } from '../context/OfflineContext';

export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function BrandTitle() {
  return <Text style={styles.brand}>Ebenezer</Text>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Sub({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sub}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="rgba(95,103,95,0.55)"
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.primaryBtn,
        (disabled || loading) && { opacity: 0.55 },
        pressed && { opacity: 0.88 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.paper} />
      ) : (
        <Text style={styles.primaryBtnText}>{title}</Text>
      )}
    </Pressable>
  );
}

export function GhostButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.8 }]}
    >
      <Text style={styles.ghostBtnText}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function Empty({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {hint ? <Text style={styles.emptyHint}>{hint}</Text> : null}
    </View>
  );
}

export function StatusBanner({
  online,
  pending,
  syncing,
  onSync,
  localOnly,
}: {
  online: boolean;
  pending: number;
  syncing?: boolean;
  onSync?: () => void;
  localOnly?: boolean;
}) {
  const ctx = useOffline();
  const local = localOnly ?? ctx.localOnly;
  if (local) {
    return (
      <Pressable
        style={{
          marginTop: 8,
          marginBottom: 4,
          borderRadius: 999,
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: 'rgba(31,122,77,0.12)',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: '700',
            color: colors.ok,
          }}
        >
          Local $5 app · full shop on this phone · no website
        </Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onSync}
      style={{
        marginTop: 8,
        marginBottom: 4,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: online
          ? pending
            ? 'rgba(154,120,64,0.16)'
            : 'rgba(31,122,77,0.12)'
          : 'rgba(180,35,24,0.1)',
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontSize: 12,
          fontWeight: '700',
          color: online
            ? pending
              ? colors.brass
              : colors.ok
            : colors.danger,
        }}
      >
        {syncing
          ? 'Syncing…'
          : online
            ? pending
              ? `Online · ${pending} waiting to sync · tap`
              : 'Online · phone copy saved'
            : pending
              ? `Offline · ${pending} saved on phone · tap later`
              : 'Offline · full shop copy on this phone'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  brand: {
    fontSize: 34,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    marginTop: 8,
  },
  sub: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.ink,
  },
  primaryBtn: {
    marginTop: 18,
    backgroundColor: colors.forest,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.paper,
    fontWeight: '700',
    fontSize: 15,
  },
  ghostBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ghostBtnText: {
    color: colors.ink,
    fontWeight: '600',
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginBottom: 12,
  },
  error: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(180,35,24,0.2)',
    backgroundColor: 'rgba(180,35,24,0.07)',
    padding: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },
  empty: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
  },
  emptyHint: {
    marginTop: 6,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 260,
  },
});
