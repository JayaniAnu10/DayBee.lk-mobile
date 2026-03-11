import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { APIClient } from '../../../src/services/apiClient';
import { Badge } from '../../../src/components/ui/Badge';
import { Loading, EmptyState } from '../../../src/components/ui/States';

export default function EmployerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const [profRes, statsRes, jobsRes] = await Promise.all([
        new APIClient<any>(`/employer/${user.id}`).get(),
        new APIClient<any>(`/employer/stats/${user.id}`).get(),
        new APIClient<any>(`/jobs/employer/${user.id}`).get(),
      ]);
      setProfile(profRes);
      setStats(statsRes);
      setJobs(Array.isArray(jobsRes) ? jobsRes : jobsRes?.content || []);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [user?.id]);

  const handleDeleteJob = (jobId: string) => {
    Alert.alert('Delete Job', 'Are you sure you want to delete this job posting?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await new APIClient(`/jobs/${jobId}`).delete();
            Toast.show({ type: 'success', text1: 'Job deleted' });
            setJobs((prev) => prev.filter((j) => j.id !== jobId));
          } catch {
            Toast.show({ type: 'error', text1: 'Failed to delete job' });
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try { await new APIClient('/auth/logout').post(); } catch { }
    await clearAuth();
    router.replace('/auth');
  };

  if (loading) return <Loading fullScreen message="Loading dashboard..." />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <LinearGradient colors={[Colors.secondary, '#1e3a5f']} style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.companyName}>{profile?.companyName || 'Employer'}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {stats && (
            <View style={styles.statsRow}>
              {[
                { label: 'Total Jobs', value: stats.totalJobs || 0 },
                { label: 'Applications', value: stats.totalApplications || 0 },
                { label: 'Pending', value: stats.pendingApplications || 0 },
                { label: 'Approved', value: stats.approvedApplications || 0 },
              ].map(({ label, value }) => (
                <View key={label} style={styles.statItem}>
                  <Text style={styles.statValue}>{value}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.postJobBtn} onPress={() => router.push('/(tabs)/employer/post-job')}>
            <Ionicons name="add-circle" size={22} color={Colors.secondary} />
            <Text style={styles.postJobText}>Post New Job</Text>
          </TouchableOpacity>
        </View>

        {/* Job listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Job Postings ({jobs.length})</Text>
          {jobs.length === 0 ? (
            <EmptyState title="No jobs posted" description="Post your first job to start hiring" icon="briefcase-outline" />
          ) : (
            jobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobCardHeader}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <View style={styles.jobActions}>
                    <TouchableOpacity
                      style={styles.jobActionBtn}
                      onPress={() => router.push({ pathname: '/(tabs)/shared/job-detail', params: { id: job.id } })}
                    >
                      <Ionicons name="eye-outline" size={18} color={Colors.info} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.jobActionBtn}
                      onPress={() => handleDeleteJob(job.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.jobMeta}>
                  <Badge label={job.category} variant="primary" />
                  <Badge label={job.jobType} variant="secondary" />
                  {job.isUrgent && <Badge label="Urgent" variant="error" />}
                </View>
                <View style={styles.jobDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.detailText}>{job.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.detailText}>{job.totalVacancies} vacancies</Text>
                  </View>
                  {job.deadline && (
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={13} color={Colors.error} />
                      <Text style={[styles.detailText, { color: Colors.error }]}>
                        Deadline: {format(new Date(job.deadline), 'MMM dd')}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.viewApplicantsBtn}
                  onPress={() => router.push({ pathname: '/job-applicants', params: { jobId: job.id } })}
                >
                  <Text style={styles.viewApplicantsText}>View Applicants</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  logoutBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  companyName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: BorderRadius.lg, padding: Spacing.base },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2, textAlign: 'center' },
  actionsSection: { padding: Spacing.base },
  postJobBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.md,
  },
  postJobText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.secondary },
  section: { paddingHorizontal: Spacing.base },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.secondary, marginBottom: Spacing.md },
  jobCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  jobTitle: { flex: 1, fontSize: FontSize.base, fontWeight: '700', color: Colors.secondary, marginRight: Spacing.sm },
  jobActions: { flexDirection: 'row', gap: Spacing.sm },
  jobActionBtn: { padding: 4 },
  jobMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: Spacing.sm },
  jobDetails: { gap: 4, marginBottom: Spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: FontSize.xs, color: Colors.textMuted },
  viewApplicantsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  viewApplicantsText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
});
