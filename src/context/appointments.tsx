import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/auth';

export type Appointment = {
  id: string;
  userId: string;
  physicianId: string;
  locationId: string;
  date: string;
  slotId: string;
  time: string;
  reason?: string;
  createdAt: string;
};

type AppointmentsContextValue = {
  appointments: Appointment[];
  bookAppointment: (input: Omit<Appointment, 'id' | 'userId' | 'createdAt'>) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
};

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);
const STORAGE_KEY = 'carebook.appointments';

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [all, setAll] = useState<Appointment[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setAll(JSON.parse(raw) as Appointment[]);
    })();
  }, []);

  const persist = async (next: Appointment[]) => {
    setAll(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<AppointmentsContextValue>(
    () => ({
      appointments: all.filter((a) => a.userId === user?.id),
      async bookAppointment(input) {
        if (!user) throw new Error('You must be signed in to book.');
        const appointment: Appointment = {
          ...input,
          id: `appt-${Date.now()}`,
          userId: user.id,
          createdAt: new Date().toISOString(),
        };
        await persist([appointment, ...all]);
        return appointment;
      },
      async cancelAppointment(id) {
        await persist(all.filter((a) => a.id !== id));
      },
    }),
    [all, user]
  );

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments must be used within AppointmentsProvider');
  return ctx;
}
