import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { format } from 'date-fns';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../src/constants/theme';
import { APIClient } from '../src/services/apiClient';
import { Badge } from '../src/components/ui/Badge';
import { Loading, EmptyState } from '../src/components/ui/States';

export default function JobApplicantsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      new APIClient<any[]>(`/applications/job/${jobId}`).get()
        .then((res) => setApplicants(Array.isArray(res) ? res : []))
        .finally(() => setLoading(false));
    }
  }, [jobId]);

  const updateStatus = async (applicationId: string, status: string) => {
    try {
      await new APIClient(`/applications/${applicationId}`).patch(undefined, { status });
      setApplicants((prev) => prev.map((a) => a.id === applicationId ? { ...a, status } : a));
      Toast.show({ type: 'success', text1: `Application ${status.toLowerCase()}` });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update status' });
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicants ({applicants.length})</Text>
      </View>

      <FlatList
        data={applicants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
        ListEmptyComponent={<EmptyState title="No applicants yet" description="Share your job to attract candidates" icon="people-outline" />}
        renderItem={({ item }) => (
          <View style={styles.applicantCard}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                {item.profilePicture ? (
                  <Image source={{ uri: item.profilePicture }} style={styles.avatarImg} />
                ) : (
                  <Ionicons name="person" size={22} color={Colors.white} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.firstName || 'Applicant'} {item.lastName || ''}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <Badge
                label={item.status || 'PENDING'}
                variant={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'error' : 'warning'}
              />
            </View>
            {item.skills && (
              <View style={styles.skills}>
                {item.skills.split(',').slice(0, 3).filter(Boolean).map((s: string) => (
                  <View key={s} style={styles.skillTag}>
                    <Text style={styles.skillText}>{s.trim()}</Text>
                  </View>
                ))}
              </View>
            )}
            {item.appliedAt && (
              <Text style={styles.appliedDate}>Applied: {format(new Date(item.appliedAt), 'MMM dd, yyyy')}</Text>
            )}
            {item.status === 'PENDING' && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Colors.success }]}
                  onPress={() => updateStatus(item.id, 'APPROVED')}
                >
                  <Ionicons name="checkmark" size={16} color={Colors.white} />
                  <Text style={styles.actionBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Colors.error }]}
                  onPress={() => updateStatus(item.id, 'REJECTED')}
                >
                  <Ionicons name="close" size={16} color={Colors.white} />
                  <Text style={styles.actionBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  backBtn: { marginBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.white },
  list: { padding: Spacing.base },
  applicantCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  name: { fontSize: FontSize.base, fontWeight: '700', color: Colors.secondary },
  email: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.sm },
  skillTag: { backgroundColor: Colors.primary + '20', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  skillText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.secondary },
  appliedDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: Spacing.sm, borderRadius: BorderRadius.md },
  actionBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSize.sm },
});
