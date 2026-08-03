import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Screen, Subtitle, Title } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { physicians } from '@/data/mock';

export default function PhysiciansScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return physicians;
    return physicians.filter(
      (p) => p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Title>Physicians</Title>
            <Subtitle>Browse specialists and book with the clinician who fits your needs.</Subtitle>
            <View style={styles.search}>
              <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name or specialty"
                placeholderTextColor={Colors.textMuted}
                style={styles.searchInput}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Avatar name={item.name} hue={item.avatarHue} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
              </View>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color={Colors.warning} />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.bio}>{item.bio}</Text>
            <View style={styles.footer}>
              <Text style={styles.meta}>{item.experienceYears} yrs experience · {item.reviewCount} reviews</Text>
              <Button
                label="Book"
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/book',
                    params: { physicianId: item.id },
                  })
                }
              />
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  search: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 10,
  },
  card: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  name: {
    fontFamily: Fonts.sansSemi,
    fontSize: 17,
    color: Colors.text,
  },
  specialty: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.primaryDark,
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningSoft,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  ratingText: {
    fontFamily: Fonts.sansSemi,
    fontSize: 12,
    color: Colors.text,
  },
  bio: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: 4,
    gap: Spacing.sm,
  },
  meta: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
