import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { format } from 'date-fns';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { Badge } from '../../../src/components/ui/Badge';
import { Loading, EmptyState } from '../../../src/components/ui/States';

export default function AdminJobsScreen() {
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const fetchJobs = async () => {
    try {
      const endpoint = filter === 'ALL' ? '/admin/jobs' : `/admin/jobs/status/${filter}`;
      const res = await new APIClient<any>(endpoint).getAll({ page: 0, size: 50 });
      setJobs(res?.content || res || []);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [filter]);

  const handleApprove = (job: any) => {
    Alert.alert('Approve Job', `Approve "${job.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          try {
            await new APIClient(`/admin/jobs/${job.id}/approve`).patch();
            setJobs((prev) => prev.filter((j) => j.id !== job.id));
            Toast.show({ type: 'success', text1: 'Job approved' });
          } catch {
            Toast.show({ type: 'error', text1: 'Failed to approve job' });
          }
        },
      },
    ]);
  };

  const handleReject = (job: any) => {
    Alert.alert('Reject Job', `Reject "${job.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive',
        onPress: async () => {
          try {
            await new APIClient(`/admin/jobs/${job.id}/reject`).patch();
            setJobs((prev) => prev.filter((j) => j.id !== job.id));
            Toast.show({ type: 'success', text1: 'Job rejected' });
          } catch {
            Toast.show({ type: 'error', text1: 'Failed to reject job' });
          }
        },
      },
    ]);
  };

  const handleDelete = (job: any) => {
    Alert.alert('Delete Job', `Permanently delete "${job.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await new APIClient(`/admin/jobs/${job.id}`).delete();
            setJobs((prev) => prev.filter((j) => j.id !== job.id));
            Toast.show({ type: 'success', text1: 'Job deleted' });
          } catch {
            Toast.show({ type: 'error', text1: 'Failed to delete job' });
          }
        },
      },
    ]);
  };

  if (loading) return <Loading fullScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Moderate Jobs</Text>
        <View style={styles.filterRow}>
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((f) => (
            <TouchableOpacity key={f} style={[styles.filterTab, filter === f && styles.filterTabActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJobs(); }} tintColor={Colors.primary} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        ListEmptyComponent={<EmptyState title={`No ${filter.toLowerCase()} jobs`} icon="briefcase-outline" />}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
              <Badge
                label={item.status || 'PENDING'}
                variant={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'error' : 'warning'}
              />
            </View>
            <View style={styles.jobMeta}>
              <Text style={styles.metaText}>{item.location}</Text>
              <Text style={styles.metaText}>·</Text>
              <Text style={styles.metaText}>{item.employer || 'Unknown'}</Text>
            </View>
            {item.postedDate && (
              <Text style={styles.dateText}>Posted: {format(new Date(item.postedDate), 'MMM dd, yyyy')}</Text>
            )}
            {(filter === 'PENDING' || filter === 'ALL') && item.status !== 'APPROVED' && item.status !== 'REJECTED' && (
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleApprove(item)}>
                  <Ionicons name="checkmark" size={16} color={Colors.white} />
                  <Text style={styles.actionBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(item)}>
                  <Ionicons name="close" size={16} color={Colors.white} />
                  <Text style={styles.actionBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
              <Ionicons name="trash-outline" size={16} color={Colors.error} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: Spacing.md },
  filterRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: BorderRadius.lg, padding: 2 },
  filterTab: { flex: 1, paddingVertical: Spacing.sm - 2, alignItems: 'center', borderRadius: BorderRadius.md },
  filterTabActive: { backgroundColor: Colors.primary },
  filterTabText: { fontSize: FontSize.xs, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  filterTabTextActive: { color: Colors.secondary },
  list: { padding: Spacing.base },
  jobCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xs },
  jobTitle: { flex: 1, fontSize: FontSize.base, fontWeight: '700', color: Colors.secondary, marginRight: Spacing.sm },
  jobMeta: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.xs },
  metaText: { fontSize: FontSize.sm, color: Colors.textMuted },
  dateText: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: Spacing.sm, borderRadius: BorderRadius.md },
  approveBtn: { backgroundColor: Colors.success },
  rejectBtn: { backgroundColor: Colors.error },
  actionBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSize.sm },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  deleteBtnText: { fontSize: FontSize.sm, color: Colors.error, fontWeight: '500' },
});
