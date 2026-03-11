import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { JobCard } from '../../../src/components/common/JobCard';
import { Button } from '../../../src/components/ui/Button';
import { Loading, EmptyState } from '../../../src/components/ui/States';

export default function NearbyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [city, setCity] = useState('');
  const [radius, setRadius] = useState('10');

  const searchNearby = async () => {
    if (!city) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await new APIClient<any>(`/jobs/search?location=${encodeURIComponent(city)}`).getAll({ page: 0, size: 20 });
      setJobs(res?.jobs?.content || res?.content || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Nearby Jobs</Text>
        <Text style={styles.headerSub}>Find jobs close to you</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="location-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter city or area (e.g. Colombo)"
              placeholderTextColor={Colors.textLight}
              value={city}
              onChangeText={setCity}
              returnKeyType="search"
              onSubmitEditing={searchNearby}
            />
          </View>
        </View>
        <Button title="Search Nearby" onPress={searchNearby} fullWidth style={{ marginTop: Spacing.sm }} />
      </View>

      {loading ? (
        <Loading message="Finding nearby jobs..." />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push({ pathname: '/(tabs)/shared/job-detail', params: { id: item.id } })}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
          ListEmptyComponent={
            searched ? (
              <EmptyState
                title="No jobs found"
                description={`No jobs found in "${city}". Try a different location.`}
                icon="location-outline"
              />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="location-outline" size={60} color={Colors.textLight} />
                <Text style={styles.placeholderText}>Enter a location to find nearby jobs</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2, marginBottom: Spacing.md },
  searchRow: { flexDirection: 'row', gap: Spacing.sm },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, gap: Spacing.sm, minHeight: 44,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  list: { padding: Spacing.base },
  placeholder: { alignItems: 'center', padding: Spacing.xxxl },
  placeholderText: { fontSize: FontSize.base, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.md },
});
