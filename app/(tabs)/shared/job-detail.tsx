import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { useAuthStore } from '../../../src/store/authStore';
import { Badge } from '../../../src/components/ui/Badge';
import { Button } from '../../../src/components/ui/Button';
import { Loading } from '../../../src/components/ui/States';
import type { Job } from '../../../src/types';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      new APIClient<Job>(`/jobs/${id}`).get()
        .then(setJob)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleApply = async () => {
    if (!selectedSchedule) {
      Toast.show({ type: 'error', text1: 'Please select a schedule' });
      return;
    }
    if (!user?.id || !id) return;
    setApplying(true);
    try {
      await new APIClient('/applications').post({
        jobId: id,
        jobseeker: user.id,
        scheduleId: selectedSchedule,
      });
      Toast.show({ type: 'success', text1: 'Application submitted successfully!' });
      setShowScheduleModal(false);
      router.back();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to apply. Try again.';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setApplying(false);
    }
  };

  const formatDateTime = (dt: string) => {
    try { return format(new Date(dt), 'MMM dd, yyyy HH:mm'); }
    catch { return dt; }
  };

  if (loading) return <Loading fullScreen message="Loading job details..." />;
  if (!job) return null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.secondary, '#1e3a5f']}
        style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{job.title}</Text>
        {job.isUrgent && (
          <View style={styles.urgentTag}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        {/* Title & Category */}
        <View style={styles.titleSection}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.badges}>
            <Badge label={job.category} variant="primary" />
            <Badge label={job.jobType} variant="secondary" />
            {job.isUrgent && <Badge label="🔥 Urgent" variant="error" />}
          </View>
          <Text style={styles.employer}>{job.employer}</Text>
        </View>

        {/* Key Info */}
        <View style={styles.infoGrid}>
          {[
            { icon: 'location-outline', label: 'Location', value: job.location },
            { icon: 'cash-outline', label: 'Salary', value: `LKR ${job.minSalary?.toLocaleString()}${job.maxSalary ? ` - ${job.maxSalary?.toLocaleString()}` : ''}/hr` },
            { icon: 'people-outline', label: 'Vacancies', value: `${job.totalVacancies} positions` },
            { icon: 'time-outline', label: 'Deadline', value: job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'N/A' },
            { icon: 'bed-outline', label: 'Accommodation', value: job.accommodation || 'Not provided' },
            { icon: 'person-outline', label: 'Gender Required', value: job.requiredGender || 'Any' },
          ].map(({ icon, label, value }) => (
            <View key={label} style={styles.infoItem}>
              <Ionicons name={icon as any} size={18} color={Colors.primary} />
              <View>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Description */}
        {job.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.sectionText}>{job.description}</Text>
          </View>
        )}

        {/* Requirements */}
        {job.requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Text style={styles.sectionText}>{job.requirements}</Text>
          </View>
        )}

        {/* Schedules */}
        {job.jobSchedules?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Schedules</Text>
            {job.jobSchedules.map((schedule, idx) => (
              <View key={schedule.id} style={styles.scheduleCard}>
                <View style={styles.scheduleNum}>
                  <Text style={styles.scheduleNumText}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scheduleTime}>
                    {formatDateTime(schedule.startDatetime as unknown as string)}
                  </Text>
                  <Text style={styles.scheduleTime}>
                    to {formatDateTime(schedule.endDatetime as unknown as string)}
                  </Text>
                  <Text style={styles.scheduleWorkers}>
                    {schedule.requiredWorkers} workers needed
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Apply Button (only for jobseekers) */}
      {user?.isJobseeker && (
        <View style={[styles.applyBar, { paddingBottom: insets.bottom + Spacing.base }]}>
          <Button
            title="Apply Now"
            onPress={() => setShowScheduleModal(true)}
            fullWidth size="lg"
          />
        </View>
      )}

      {/* Schedule Selection Modal */}
      <Modal visible={showScheduleModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Schedule</Text>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {job.jobSchedules?.map((schedule, idx) => (
                <TouchableOpacity
                  key={schedule.id}
                  style={[styles.scheduleOption, selectedSchedule === schedule.id && styles.scheduleOptionActive]}
                  onPress={() => setSelectedSchedule(schedule.id)}
                >
                  <View style={styles.scheduleOptionRadio}>
                    {selectedSchedule === schedule.id && (
                      <View style={styles.scheduleOptionRadioFill} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scheduleOptionTitle}>Schedule {idx + 1}</Text>
                    <Text style={styles.scheduleOptionTime}>{formatDateTime(schedule.startDatetime as unknown as string)}</Text>
                    <Text style={styles.scheduleOptionTime}>to {formatDateTime(schedule.endDatetime as unknown as string)}</Text>
                    <Text style={styles.scheduleOptionWorkers}>{schedule.requiredWorkers} workers needed</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                title="Submit Application"
                onPress={handleApply}
                loading={applying}
                disabled={!selectedSchedule}
                fullWidth size="lg"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  backBtn: { marginBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  urgentTag: { backgroundColor: Colors.error, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 2, alignSelf: 'flex-start', marginTop: Spacing.xs },
  urgentText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.white },
  content: { padding: Spacing.base },
  titleSection: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  jobTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.sm },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.sm },
  employer: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  infoGrid: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  infoValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  section: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.secondary, marginBottom: Spacing.sm },
  sectionText: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 20 },
  scheduleCard: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.md, backgroundColor: Colors.background, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  scheduleNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  scheduleNumText: { color: Colors.secondary, fontWeight: '700', fontSize: FontSize.sm },
  scheduleTime: { fontSize: FontSize.sm, color: Colors.text },
  scheduleWorkers: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  applyBar: { padding: Spacing.base, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.xl, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.secondary },
  scheduleOption: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    padding: Spacing.md, borderRadius: BorderRadius.lg,
    borderWidth: 2, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  scheduleOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  scheduleOptionRadio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  scheduleOptionRadioFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  scheduleOptionTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.secondary },
  scheduleOptionTime: { fontSize: FontSize.sm, color: Colors.text },
  scheduleOptionWorkers: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  modalFooter: { marginTop: Spacing.xl, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
});
