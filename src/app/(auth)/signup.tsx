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

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password, phone);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create account.');
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
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.brand}>CareBook</Text>
          <Text style={styles.title}>Create your patient account</Text>
          <Text style={styles.subtitle}>A few details so we can keep your visits and medications organized.</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.form}>
            <Input label="Full name" value={name} onChangeText={setName} placeholder="Alex Morgan" />
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
              label="Phone (optional)"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
            />
            <Input
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Create account" onPress={onSubmit} loading={loading} icon="person-add-outline" />
          </View>

          <Text style={styles.footer}>
            Already registered?{' '}
            <Link href="/(auth)/login" style={styles.link}>
              Sign in
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
    gap: Spacing.lg,
  },
  brand: {
    fontFamily: Fonts.serifSemi,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.serifBold,
    fontSize: 32,
    lineHeight: 38,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  panel: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  form: {
    gap: Spacing.md,
  },
  error: {
    fontFamily: Fonts.sans,
    color: Colors.danger,
    fontSize: 13,
  },
  footer: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  link: {
    fontFamily: Fonts.sansSemi,
    color: Colors.primary,
  },
});
