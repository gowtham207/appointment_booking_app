import { Button, Card, Chip, Screen, Subtitle, Title } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { locations, type Location } from '@/data/mock';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const filters: Array<'All' | Location['type']> = ['All', 'Clinic', 'Hospital', 'Specialty Center'];

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((l) => {
      const matchesFilter = filter === 'All' || l.type === filter;
      const matchesQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

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
            <Title>Locations</Title>
            <Subtitle>Find a clinic, hospital, or specialty center near you.</Subtitle>
            <View style={styles.search}>
              <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name or city"
                placeholderTextColor={Colors.textMuted}
                style={styles.searchInput}
              />
            </View>
            <View style={styles.chips}>
              {filters.map((item) => (
                <Chip key={item} label={item} selected={filter === item} onPress={() => setFilter(item)} />
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
              <Text style={styles.meta}>
                {item.address}, {item.city}, {item.state} {item.zip}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <Text style={styles.meta}>{item.hours}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="call-outline" size={16} color={Colors.primary} />
              <Text style={styles.meta}>{item.phone}</Text>
            </View>
            <View style={{ marginTop: Spacing.sm }}>
              <Button
                label="Book here"
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/book',
                    params: { locationId: item.id },
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
    gap: Spacing.sm,
  },
  search: {
    marginTop: Spacing.sm,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.sm,
  },
  card: {
    gap: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  typeText: {
    fontFamily: Fonts.sansSemi,
    fontSize: 11,
    color: Colors.accent,
  },
  name: {
    fontFamily: Fonts.sansSemi,
    fontSize: 18,
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  meta: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});
