import { Avatar, Button, Card, Screen } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useAppointments } from '@/context/appointments';
import { useAuth } from '@/context/auth';
import { getLocationById, getPhysicianById, medications } from '@/data/mock';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const next = appointments[0];
  const physician = getPhysicianById(next?.physicianId);
  const location = getLocationById(next?.locationId);
  const activeMeds = medications.filter((m) => m.status === 'Active').length;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.name}>{user?.name?.split(' ')[0] || 'Patient'}</Text>
          </View>
          <View style={styles.brandChip}>
            <Text style={styles.brandChipText}>CareBook</Text>
          </View>
        </View>

        <View style={styles.heroBand}>
          <Text style={styles.heroTitle}>Your care, clearly scheduled</Text>
          <Text style={styles.heroCopy}>Book visits, review physicians, and keep medications in view.</Text>
          <Button label="Book appointment" onPress={() => router.push('/(tabs)/book')} icon="calendar" />
        </View>

        <Text style={styles.section}>Upcoming</Text>
        {next && physician && location ? (
          <Card>
            <View style={styles.row}>
              <Avatar name={physician.name} hue={physician.avatarHue} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{physician.name}</Text>
                <Text style={styles.cardMeta}>{physician.specialty}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
              <Text style={styles.metaText}>
                {next.date} · {next.time}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={16} color={Colors.primary} />
              <Text style={styles.metaText}>{location.name}</Text>
            </View>
          </Card>
        ) : (
          <Card>
            <Text style={styles.cardTitle}>No visits booked yet</Text>
            <Text style={styles.cardMeta}>Choose a physician, location, and time slot when you are ready.</Text>
            <View style={{ marginTop: Spacing.md }}>
              <Button label="Start booking" variant="secondary" onPress={() => router.push('/(tabs)/book')} />
            </View>
          </Card>
        )}

        <Text style={styles.section}>At a glance</Text>
        <View style={styles.stats}>
          <PressStat
            icon="medkit-outline"
            label="Physicians"
            value="5"
            onPress={() => router.push('/(tabs)/physicians')}
          />
          <PressStat
            icon="location-outline"
            label="Locations"
            value="4"
            onPress={() => router.push('/(tabs)/locations')}
          />
          <PressStat
            icon="flask-outline"
            label="Active meds"
            value={String(activeMeds)}
            onPress={() => router.push('/(tabs)/medications')}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

function PressStat({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  name: {
    fontFamily: Fonts.serifBold,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.4,
  },
  brandChip: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  brandChipText: {
    fontFamily: Fonts.sansSemi,
    fontSize: 12,
    color: Colors.primaryDark,
  },
  heroBand: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  heroTitle: {
    fontFamily: Fonts.serifBold,
    fontSize: 26,
    lineHeight: 32,
    color: '#fff',
    letterSpacing: -0.3,
  },
  heroCopy: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.88)',
    marginBottom: Spacing.sm,
  },
  section: {
    fontFamily: Fonts.sansSemi,
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontFamily: Fonts.sansSemi,
    fontSize: 16,
    color: Colors.text,
  },
  cardMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  metaText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontFamily: Fonts.serifBold,
    fontSize: 22,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
