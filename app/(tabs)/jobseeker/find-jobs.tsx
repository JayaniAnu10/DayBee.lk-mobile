import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal,
  ScrollView, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { JobCard } from '../../../src/components/common/JobCard';
import { Button } from '../../../src/components/ui/Button';
import { Loading, EmptyState } from '../../../src/components/ui/States';
import type { Job } from '../../../src/types';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary'];
const CATEGORIES = ['Technology', 'Retail', 'Hospitality', 'Food Service', 'Healthcare', 'Education', 'Construction', 'Manufacturing'];

export default function FindJobsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '', jobType: '', location: '' });
  const [appliedFilters, setAppliedFilters] = useState({ category: '', jobType: '', location: '' });

  const fetchJobs = useCallback(async (p: number = 0, search = searchQuery, f = appliedFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('query', search);
      if (f.category) params.append('category', f.category);
      if (f.jobType) params.append('jobType', f.jobType);
      if (f.location) params.append('location', f.location);

      const res = await new APIClient<any>(`/jobs/search?${params.toString()}`).getAll({ page: p, size: 10 });
      const content = res?.jobs?.content || res?.content || [];
      setJobs(p === 0 ? content : (prev) => [...prev, ...content]);
      setTotalPages(res?.jobs?.totalPages || res?.totalPages || 0);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, appliedFilters]);

  React.useEffect(() => { fetchJobs(0); }, []);

  const handleSearch = () => fetchJobs(0);

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowFilters(false);
    fetchJobs(0, searchQuery, filters);
  };

  const clearFilters = () => {
    const empty = { category: '', jobType: '', location: '' };
    setFilters(empty);
    setAppliedFilters(empty);
    setShowFilters(false);
    fetchJobs(0, searchQuery, empty);
  };

  const loadMore = () => {
    if (page + 1 < totalPages && !loading) {
      fetchJobs(page + 1);
    }
  };

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Find Jobs</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, categories..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => { setSearchQuery(''); fetchJobs(0, '', appliedFilters); }}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={20} color={activeFilterCount > 0 ? Colors.secondary : Colors.white} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Jobs list */}
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
        ListEmptyComponent={!loading ? <EmptyState title="No jobs found" description="Try adjusting your search filters" icon="briefcase-outline" /> : null}
        ListFooterComponent={loading ? <Loading /> : null}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>Category</Text>
              <View style={styles.chipRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, filters.category === cat && styles.chipActive]}
                    onPress={() => setFilters({ ...filters, category: filters.category === cat ? '' : cat })}
                  >
                    <Text style={[styles.chipText, filters.category === cat && styles.chipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Job Type</Text>
              <View style={styles.chipRow}>
                {JOB_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, filters.jobType === type && styles.chipActive]}
                    onPress={() => setFilters({ ...filters, jobType: filters.jobType === type ? '' : type })}
                  >
                    <Text style={[styles.chipText, filters.jobType === type && styles.chipTextActive]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Location</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g. Colombo"
                value={filters.location}
                onChangeText={(v) => setFilters({ ...filters, location: v })}
                placeholderTextColor={Colors.textLight}
              />
            </ScrollView>
            <View style={styles.filterFooter}>
              <Button title="Clear All" variant="outline" onPress={clearFilters} style={{ flex: 1, marginRight: Spacing.sm }} />
              <Button title="Apply Filters" onPress={applyFilters} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: Spacing.md },
  searchRow: { flexDirection: 'row', gap: Spacing.sm },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, gap: Spacing.sm, minHeight: 44,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  filterBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center',
  },
  filterBadgeText: { fontSize: 10, color: Colors.white, fontWeight: '700' },
  list: { padding: Spacing.base },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  filterSheet: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.xl, maxHeight: '80%',
  },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  filterTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.secondary },
  filterLabel: { fontSize: FontSize.base, fontWeight: '600', color: Colors.secondary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '20' },
  chipText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  chipTextActive: { color: Colors.secondary, fontWeight: '600' },
  filterInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, height: 44, fontSize: FontSize.base, color: Colors.text,
  },
  filterFooter: { flexDirection: 'row', marginTop: Spacing.xl, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
});
