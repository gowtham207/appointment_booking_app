import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const AUTH_KEY = 'carebook.auth.user';

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type AuthContextValue = {
  user: Patient | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type StoredAccount = Patient & { password: string };

async function getAccounts(): Promise<StoredAccount[]> {
  const raw = await AsyncStorage.getItem('carebook.accounts');
  return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
}

async function saveAccounts(accounts: StoredAccount[]) {
  await AsyncStorage.setItem('carebook.accounts', JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_KEY);
        if (raw) setUser(JSON.parse(raw) as Patient);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      async login(email, password) {
        const normalized = email.trim().toLowerCase();
        if (!normalized || !password) {
          throw new Error('Enter your email and password.');
        }

        const accounts = await getAccounts();
        const match = accounts.find((a) => a.email === normalized && a.password === password);

        if (!match) {
          // Demo convenience: allow first-time login to create a session if no account exists
          if (accounts.length === 0) {
            const demoUser: Patient = {
              id: 'demo-1',
              name: normalized.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              email: normalized,
            };
            await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(demoUser));
            setUser(demoUser);
            return;
          }
          throw new Error('Invalid email or password.');
        }

        const nextUser: Patient = {
          id: match.id,
          name: match.name,
          email: match.email,
          phone: match.phone,
        };
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      },
      async signup(name, email, password, phone) {
        const normalized = email.trim().toLowerCase();
        const trimmedName = name.trim();

        if (!trimmedName || !normalized || password.length < 6) {
          throw new Error('Name, email, and a password of at least 6 characters are required.');
        }

        const accounts = await getAccounts();
        if (accounts.some((a) => a.email === normalized)) {
          throw new Error('An account with this email already exists.');
        }

        const next: StoredAccount = {
          id: `u-${Date.now()}`,
          name: trimmedName,
          email: normalized,
          phone: phone?.trim() || undefined,
          password,
        };

        await saveAccounts([...accounts, next]);
        const session: Patient = {
          id: next.id,
          name: next.name,
          email: next.email,
          phone: next.phone,
        };
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
        setUser(session);
      },
      async logout() {
        await AsyncStorage.removeItem(AUTH_KEY);
        setUser(null);
      },
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
