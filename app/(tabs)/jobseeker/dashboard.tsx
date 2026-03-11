import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { APIClient } from '../../../src/services/apiClient';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Loading, EmptyState } from '../../../src/components/ui/States';

export default function JobseekerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const [profileRes, statsRes] = await Promise.all([
        new APIClient<any>(`/jobseeker/${user.id}`).get(),
        new APIClient<any>(`/jobseeker/stats/${user.id}`).get(),
      ]);
      setProfile(profileRes);
      setStats(statsRes);

      const [jobsRes, recRes] = await Promise.allSettled([
        new APIClient<any>('/jobs').getAll({ page: 0, size: 5 }),
        new APIClient<any>(`/recommendations/seeker/${user.id}`).get(),
      ]);
      if (jobsRes.status === 'fulfilled') setRecentJobs(jobsRes.value?.content || jobsRes.value || []);
      if (recRes.status === 'fulfilled') setRecommended(recRes.value?.slice?.(0, 5) || []);
    } catch (e) {
      // ignore partial failures
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [user?.id]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };
  const handleLogout = async () => { await clearAuth(); router.replace('/auth'); };

  if (loading) return <Loading fullScreen message="Loading dashboard..." />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.secondary, '#1e3a5f']}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>
              {profile?.firstName || 'Job Seeker'} {profile?.lastName || ''}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => router.push('/(tabs)/jobseeker/notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats row */}
        {stats && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalApplications || 0}</Text>
              <Text style={styles.statLabel}>Applied</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.upcomingJobs || 0}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedJobs || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(stats.averageRating || 0).toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating ⭐</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/jobseeker/find-jobs')}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="search" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionText}>Find Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/shared/nearby')}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.info + '20' }]}>
                <Ionicons name="location" size={24} color={Colors.info} />
              </View>
              <Text style={styles.actionText}>Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/jobseeker/history')}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.success + '20' }]}>
                <Ionicons name="time" size={24} color={Colors.success} />
              </View>
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/shared/chat')}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.secondary + '15' }]}>
                <Ionicons name="chatbubble" size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.actionText}>AI Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Jobs */}
        {recommended.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobseeker/find-jobs')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommended.map((job: any) => (
                <TouchableOpacity
                  key={job.id}
                  style={styles.recCard}
                  onPress={() => router.push({ pathname: '/(tabs)/shared/job-detail', params: { id: job.id } })}
                >
                  <Badge label={job.category} variant="primary" />
                  <Text style={styles.recTitle} numberOfLines={2}>{job.title}</Text>
                  <View style={styles.recRow}>
                    <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                    <Text style={styles.recMeta} numberOfLines={1}>{job.location}</Text>
                  </View>
                  <Text style={styles.recSalary}>LKR {job.minSalary?.toLocaleString()}/hr</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recent Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/jobseeker/find-jobs')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {recentJobs.length === 0 ? (
            <EmptyState title="No jobs available" icon="briefcase-outline" />
          ) : (
            recentJobs.map((job: any) => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobRow}
                onPress={() => router.push({ pathname: '/(tabs)/shared/job-detail', params: { id: job.id } })}
              >
                <View style={styles.jobIconBox}>
                  <Ionicons name="briefcase-outline" size={20} color={Colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.jobMeta}>{job.location} · {job.category}</Text>
                </View>
                <View>
                  <Text style={styles.jobSalary}>LKR {job.minSalary?.toLocaleString()}</Text>
                  {job.isUrgent && <Badge label="Urgent" variant="error" style={{ alignSelf: 'flex-end' }} />}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  notifBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: BorderRadius.lg, padding: Spacing.base },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  scrollContent: { padding: Spacing.base },
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.secondary },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', gap: Spacing.sm },
  actionCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
  },
  actionIcon: { width: 48, height: 48, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  actionText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.secondary, textAlign: 'center' },
  recCard: {
    width: 160, backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
  },
  recTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.secondary, marginVertical: Spacing.xs },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recMeta: { fontSize: FontSize.xs, color: Colors.textMuted, flex: 1 },
  recSalary: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary, marginTop: Spacing.xs },
  jobRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.md, ...Shadow.sm,
  },
  jobIconBox: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.secondary + '10', alignItems: 'center', justifyContent: 'center' },
  jobTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.secondary },
  jobMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  jobSalary: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
});
