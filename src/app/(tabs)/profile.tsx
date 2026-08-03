import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Screen, Title } from '@/components/ui';
import { useAppointments } from '@/context/appointments';
import { useAuth } from '@/context/auth';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getLocationById, getPhysicianById } from '@/data/mock';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { appointments, cancelAppointment } = useAppointments();

  const onLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Title>Profile</Title>

        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'P')
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.phone ? <Text style={styles.email}>{user.phone}</Text> : null}
          </View>
        </Card>

        <Text style={styles.section}>Your appointments</Text>
        {appointments.length === 0 ? (
          <Card>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptyCopy}>Booked visits will appear here for quick review.</Text>
          </Card>
        ) : (
          appointments.map((item) => {
            const physician = getPhysicianById(item.physicianId);
            const location = getLocationById(item.locationId);
            return (
              <Card key={item.id} style={styles.apptCard}>
                <Text style={styles.apptTitle}>{physician?.name}</Text>
                <Text style={styles.apptMeta}>
                  {item.date} · {item.time}
                </Text>
                <Text style={styles.apptMeta}>{location?.name}</Text>
                {item.reason ? <Text style={styles.apptReason}>{item.reason}</Text> : null}
                <Button
                  label="Cancel visit"
                  variant="ghost"
                  onPress={() =>
                    Alert.alert('Cancel appointment', 'Remove this visit from your schedule?', [
                      { text: 'Keep', style: 'cancel' },
                      {
                        text: 'Cancel visit',
                        style: 'destructive',
                        onPress: () => cancelAppointment(item.id),
                      },
                    ])
                  }
                />
              </Card>
            );
          })
        )}

        <View style={styles.logout}>
          <Button label="Sign out" variant="danger" onPress={onLogout} icon="log-out-outline" />
        </View>

        <View style={styles.footerNote}>
          <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.footerText}>Patient session is stored securely on this device.</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.sansSemi,
    fontSize: 22,
    color: Colors.primaryDark,
  },
  name: {
    fontFamily: Fonts.sansSemi,
    fontSize: 20,
    color: Colors.text,
  },
  email: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    fontFamily: Fonts.sansSemi,
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
  },
  emptyTitle: {
    fontFamily: Fonts.sansSemi,
    fontSize: 16,
    color: Colors.text,
  },
  emptyCopy: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  apptCard: {
    gap: 4,
  },
  apptTitle: {
    fontFamily: Fonts.sansSemi,
    fontSize: 16,
    color: Colors.text,
  },
  apptMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  apptReason: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  logout: {
    marginTop: Spacing.md,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
