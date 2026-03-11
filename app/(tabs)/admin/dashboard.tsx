import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { useAuthStore } from '../../../src/store/authStore';
import { Loading } from '../../../src/components/ui/States';

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [overview, setOverview] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [ov, jobs] = await Promise.all([
        new APIClient<any>('/admin/analytics/overview').get(),
        new APIClient<any[]>('/admin/jobs/recent').get().catch(() => []),
      ]);
      setOverview(ov);
      setRecentJobs(Array.isArray(jobs) ? jobs.slice(0, 5) : []);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    try { await new APIClient('/auth/logout').post(); } catch { }
    await clearAuth(); router.replace('/auth');
  };

  if (loading) return <Loading fullScreen />;

  const stats = [
    { label: 'Total Users', value: overview?.totalUsers || 0, icon: 'people-outline', color: Colors.info },
    { label: 'Active Jobs', value: overview?.activeJobs || 0, icon: 'briefcase-outline', color: Colors.success },
    { label: 'Applications', value: overview?.totalApplications || 0, icon: 'document-text-outline', color: Colors.primary },
    { label: 'Revenue', value: `$${overview?.totalRevenue || 0}`, icon: 'card-outline', color: Colors.warning },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <LinearGradient colors={[Colors.secondary, '#1a2f4e']} style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Admin Dashboard</Text>
              <Text style={styles.subtitle}>Smart Part-Time Platform</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map(({ label, value, icon, color }) => (
            <View key={label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon as any} size={22} color={color} />
              </View>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { label: 'Manage Users', icon: 'people', route: '/(tabs)/admin/users', color: Colors.info },
              { label: 'Moderate Jobs', icon: 'briefcase', route: '/(tabs)/admin/jobs', color: Colors.success },
              { label: 'Reports', icon: 'flag', route: '/(tabs)/admin/complaints', color: Colors.error },
              { label: 'Analytics', icon: 'bar-chart', route: '/(tabs)/admin/analytics', color: Colors.warning },
            ].map(({ label, icon, route, color }) => (
              <TouchableOpacity
                key={label}
                style={styles.actionCard}
                onPress={() => router.push(route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
                  <Ionicons name={icon as any} size={24} color={color} />
                </View>
                <Text style={styles.actionLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Jobs */}
        {recentJobs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Job Posts</Text>
            {recentJobs.map((job) => (
              <View key={job.id} style={styles.jobRow}>
                <View style={styles.jobIcon}>
                  <Ionicons name="briefcase-outline" size={18} color={Colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.jobMeta}>{job.location} · {job.status || 'Pending'}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: job.status === 'APPROVED' ? Colors.success : job.status === 'REJECTED' ? Colors.error : Colors.warning }]} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  subtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  logoutBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.base, gap: Spacing.sm },
  statCard: {
    width: '48%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  statIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.secondary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.secondary, marginBottom: Spacing.md },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionCard: { width: '48%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', ...Shadow.sm },
  actionIcon: { width: 52, height: 52, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  actionLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.secondary, textAlign: 'center' },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  jobIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.secondary + '15', alignItems: 'center', justifyContent: 'center' },
  jobTitle: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.secondary },
  jobMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
});
