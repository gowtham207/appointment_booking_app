import { Avatar, Button, Card, Screen, SectionLabel, Subtitle, Title } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useAppointments } from '@/context/appointments';
import {
  getUpcomingDates,
  locations,
  physicians,
  timeSlots,
  type TimeSlot,
} from '@/data/mock';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const steps = ['Physician', 'Location', 'Schedule', 'Confirm'] as const;

export default function BookScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ physicianId?: string; locationId?: string }>();
  const { bookAppointment } = useAppointments();
  const dates = useMemo(() => getUpcomingDates(7), []);

  const [step, setStep] = useState(0);
  const [physicianId, setPhysicianId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [dateId, setDateId] = useState<string | null>(dates[0]?.id ?? null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.physicianId) {
      setPhysicianId(String(params.physicianId));
      setStep(1);
    }
    if (params.locationId) {
      setLocationId(String(params.locationId));
      if (!params.physicianId) setStep(0);
    }
  }, [params.physicianId, params.locationId]);

  const physician = physicians.find((p) => p.id === physicianId);
  const availableLocations = useMemo(() => {
    if (!physician) return locations;
    return locations.filter((l) => physician.locationIds.includes(l.id));
  }, [physician]);

  const location = locations.find((l) => l.id === locationId);
  const date = dates.find((d) => d.id === dateId);
  const slot = timeSlots.find((s) => s.id === slotId);

  const groupedSlots = useMemo(() => {
    return timeSlots.reduce<Record<TimeSlot['period'], TimeSlot[]>>(
      (acc, item) => {
        acc[item.period].push(item);
        return acc;
      },
      { Morning: [], Afternoon: [], Evening: [] }
    );
  }, []);

  const canContinue =
    (step === 0 && !!physicianId) ||
    (step === 1 && !!locationId) ||
    (step === 2 && !!dateId && !!slotId) ||
    step === 3;

  const onNext = async () => {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    if (!physicianId || !locationId || !dateId || !slot) return;

    setLoading(true);
    try {
      await bookAppointment({
        physicianId,
        locationId,
        date: dateId,
        slotId: slot.id,
        time: slot.time,
        reason: reason.trim() || undefined,
      });
      Alert.alert('Appointment booked', 'Your visit has been scheduled.', [
        { text: 'Done', onPress: () => router.replace('/(tabs)') },
      ]);
      setStep(0);
      setPhysicianId(null);
      setLocationId(null);
      setSlotId(null);
      setReason('');
    } catch (e) {
      Alert.alert('Booking failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
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
        <Title>Book visit</Title>
        <Subtitle>Select physician, location, date, and a time slot.</Subtitle>

        <View style={styles.stepper}>
          {steps.map((label, index) => {
            const active = index === step;
            const done = index < step;
            return (
              <View key={label} style={styles.stepItem}>
                <View style={[styles.stepDot, (active || done) && styles.stepDotActive]}>
                  {done ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>{index + 1}</Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
              </View>
            );
          })}
        </View>

        {step === 0 && (
          <View style={styles.block}>
            <SectionLabel>Choose physician</SectionLabel>
            {physicians.map((item) => (
              <Card
                key={item.id}
                selected={physicianId === item.id}
                onPress={() => {
                  setPhysicianId(item.id);
                  if (locationId && !item.locationIds.includes(locationId)) {
                    setLocationId(null);
                  }
                }}
                style={styles.optionCard}
              >
                <View style={styles.row}>
                  <Avatar name={item.name} hue={item.avatarHue} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>{item.name}</Text>
                    <Text style={styles.optionMeta}>{item.specialty}</Text>
                  </View>
                  {physicianId === item.id ? (
                    <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                  ) : null}
                </View>
              </Card>
            ))}
          </View>
        )}

        {step === 1 && (
          <View style={styles.block}>
            <SectionLabel>Choose location</SectionLabel>
            {availableLocations.map((item) => (
              <Card
                key={item.id}
                selected={locationId === item.id}
                onPress={() => setLocationId(item.id)}
                style={styles.optionCard}
              >
                <Text style={styles.optionTitle}>{item.name}</Text>
                <Text style={styles.optionMeta}>
                  {item.address}, {item.city}
                </Text>
                <Text style={styles.optionMeta}>{item.hours}</Text>
              </Card>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.block}>
            <SectionLabel>Date</SectionLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
              {dates.map((item) => {
                const selected = dateId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setDateId(item.id)}
                    style={[styles.dateChip, selected && styles.dateChipSelected]}
                  >
                    <Text style={[styles.dateLabel, selected && styles.dateTextSelected]}>{item.label}</Text>
                    <Text style={[styles.dateSub, selected && styles.dateTextSelected]}>{item.sublabel}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {(['Morning', 'Afternoon', 'Evening'] as const).map((period) => (
              <View key={period} style={{ marginTop: Spacing.md }}>
                <SectionLabel>{period}</SectionLabel>
                <View style={styles.slotGrid}>
                  {groupedSlots[period].map((item) => {
                    const selected = slotId === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setSlotId(item.id)}
                        style={[styles.slot, selected && styles.slotSelected]}
                      >
                        <Text style={[styles.slotText, selected && styles.slotTextSelected]}>{item.time}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {step === 3 && physician && location && date && slot && (
          <View style={styles.block}>
            <SectionLabel>Review & confirm</SectionLabel>
            <Card style={{ gap: 12 }}>
              <View style={styles.row}>
                <Avatar name={physician.name} hue={physician.avatarHue} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{physician.name}</Text>
                  <Text style={styles.optionMeta}>{physician.specialty}</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
                <Text style={styles.summaryText}>{location.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                <Text style={styles.summaryText}>
                  {date.sublabel} · {slot.time}
                </Text>
              </View>
              <View>
                <Text style={styles.reasonLabel}>Reason for visit (optional)</Text>
                <TextInput
                  value={reason}
                  onChangeText={setReason}
                  placeholder="e.g. Annual checkup, follow-up"
                  placeholderTextColor={Colors.textMuted}
                  style={styles.reasonInput}
                  multiline
                />
              </View>
            </Card>
          </View>
        )}

        <View style={styles.actions}>
          {step > 0 ? (
            <Button label="Back" variant="ghost" onPress={() => setStep((s) => s - 1)} />
          ) : (
            <View />
          )}
          <View style={{ flex: 1 }}>
            <Button
              label={step === 3 ? 'Confirm booking' : 'Continue'}
              onPress={onNext}
              disabled={!canContinue}
              loading={loading}
              icon={step === 3 ? 'checkmark-circle-outline' : 'arrow-forward'}
            />
          </View>
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
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontFamily: Fonts.sansSemi,
    fontSize: 12,
    color: Colors.textMuted,
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.textMuted,
  },
  stepLabelActive: {
    color: Colors.primaryDark,
    fontFamily: Fonts.sansSemi,
  },
  block: {
    gap: 10,
  },
  optionCard: {
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionTitle: {
    fontFamily: Fonts.sansSemi,
    fontSize: 16,
    color: Colors.text,
  },
  optionMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dateRow: {
    gap: 10,
    paddingVertical: 4,
  },
  dateChip: {
    width: 72,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  dateChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateLabel: {
    fontFamily: Fonts.sansSemi,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  dateSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textMuted,
  },
  dateTextSelected: {
    color: '#fff',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slot: {
    minWidth: '30%',
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  slotSelected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  slotText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  slotTextSelected: {
    color: Colors.primaryDark,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
  },
  reasonLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  reasonInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.text,
    textAlignVertical: 'top',
    backgroundColor: Colors.surfaceMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
