import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Screen, Subtitle, Title } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { medications } from '@/data/mock';

export default function MedicationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Title>Medications</Title>
            <Subtitle>Your current prescriptions and refill timing, kept in one place.</Subtitle>
            <View style={styles.summary}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
              <Text style={styles.summaryText}>
                {medications.filter((m) => m.status === 'Active').length} active medications on file
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.top}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.dose}>
                  {item.dosage} · {item.frequency}
                </Text>
              </View>
              <View style={[styles.badge, item.status === 'Active' ? styles.badgeActive : styles.badgeMuted]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.instructions}>{item.instructions}</Text>

            <View style={styles.metaGrid}>
              <Meta icon="person-outline" label="Prescribed by" value={item.prescribedBy} />
              <Meta icon="calendar-outline" label="Started" value={item.startDate} />
              <Meta icon="refresh-outline" label="Next refill" value={item.nextRefill} />
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color={Colors.primary} />
      <View>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  summary: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryGlow,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.primaryDark,
  },
  card: {
    gap: Spacing.sm,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  name: {
    fontFamily: Fonts.sansSemi,
    fontSize: 18,
    color: Colors.text,
  },
  dose: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  badgeActive: {
    backgroundColor: Colors.successSoft,
  },
  badgeMuted: {
    backgroundColor: Colors.surfaceMuted,
  },
  badgeText: {
    fontFamily: Fonts.sansSemi,
    fontSize: 11,
    color: Colors.success,
  },
  instructions: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  metaGrid: {
    gap: 10,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  metaLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.textMuted,
  },
  metaValue: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.text,
  },
});
