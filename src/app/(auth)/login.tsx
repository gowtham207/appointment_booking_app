import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/auth';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 28 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>C</Text>
          </View>
          <Text style={styles.brand}>CareBook</Text>
          <Text style={styles.tagline}>Appointments, physicians, and medications — in one calm place.</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Welcome back</Text>
          <Text style={styles.panelSubtitle}>Sign in to manage your care schedule.</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
            />
            <Input
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Sign in" onPress={onSubmit} loading={loading} icon="log-in-outline" />
          </View>

          <Text style={styles.demoHint}>First visit? Any email and password will open a demo session.</Text>

          <Text style={styles.footer}>
            New here?{' '}
            <Link href="/(auth)/signup" style={styles.link}>
              Create an account
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  hero: {
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  brandMark: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandMarkText: {
    fontFamily: Fonts.serifBold,
    fontSize: 26,
    color: '#fff',
  },
  brand: {
    fontFamily: Fonts.serifBold,
    fontSize: 40,
    color: Colors.text,
    letterSpacing: -0.8,
  },
  tagline: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
    maxWidth: 320,
  },
  panel: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  panelTitle: {
    fontFamily: Fonts.sansSemi,
    fontSize: 22,
    color: Colors.text,
  },
  panelSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  form: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  error: {
    fontFamily: Fonts.sans,
    color: Colors.danger,
    fontSize: 13,
  },
  demoHint: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  footer: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  link: {
    fontFamily: Fonts.sansSemi,
    color: Colors.primary,
  },
});
