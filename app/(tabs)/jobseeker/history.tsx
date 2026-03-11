import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { useAuthStore } from '../../../src/store/authStore';
import { Badge } from '../../../src/components/ui/Badge';
import { Loading, EmptyState } from '../../../src/components/ui/States';

export default function JobHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      const res = await new APIClient<any[]>(`/jobseeker/history/${user.id}`).get();
      setHistory(Array.isArray(res) ? res : []);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [user?.id]);

  const filtered = filter === 'ALL' ? history : history.filter((h) => h.status === filter);

  const statusBadge = (status: string) => {
    if (status === 'APPROVED') return <Badge label="Approved" variant="success" />;
    if (status === 'REJECTED') return <Badge label="Rejected" variant="error" />;
    return <Badge label="Pending" variant="warning" />;
  };

  if (loading) return <Loading fullScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Job History</Text>
        <Text style={styles.headerSub}>{history.length} total applications</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchHistory(); }} tintColor={Colors.primary} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        ListEmptyComponent={<EmptyState title="No applications" description={`No ${filter.toLowerCase()} applications`} icon="time-outline" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyCard}
            onPress={() => item.status === 'APPROVED' && router.push({
              pathname: '/(tabs)/shared/job-detail',
              params: { id: item.jobId }
            })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.jobTitle} numberOfLines={1}>{item.jobTitle || 'Job Application'}</Text>
              {statusBadge(item.status)}
            </View>
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailText}>{item.location || 'Location N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailText}>
                  Applied: {item.appliedAt ? format(new Date(item.appliedAt), 'MMM dd, yyyy') : 'N/A'}
                </Text>
              </View>
              {item.scheduledDate && (
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.detailText}>
                    Scheduled: {format(new Date(item.scheduledDate), 'MMM dd, yyyy HH:mm')}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  filterRow: { flexDirection: 'row', backgroundColor: Colors.white, padding: 4, margin: Spacing.base, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border },
  filterTab: { flex: 1, paddingVertical: Spacing.sm - 2, alignItems: 'center', borderRadius: BorderRadius.md },
  filterTabActive: { backgroundColor: Colors.secondary },
  filterTabText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMuted },
  filterTabTextActive: { color: Colors.white },
  list: { paddingHorizontal: Spacing.base },
  historyCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  jobTitle: { flex: 1, fontSize: FontSize.base, fontWeight: '700', color: Colors.secondary, marginRight: Spacing.sm },
  cardDetails: { gap: Spacing.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  detailText: { fontSize: FontSize.sm, color: Colors.textMuted },
});
