import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { Badge } from '../ui/Badge';
import type { Job } from '../../types';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const formatSalary = (salary: number) => {
    return `LKR ${salary.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {job.isUrgent && (
        <View style={styles.urgentBanner}>
          <Text style={styles.urgentText}>🔥 URGENT</Text>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
        </View>
        <View style={styles.badges}>
          <Badge label={job.category} variant="primary" />
          <Badge label={job.jobType} variant="secondary" style={{ marginLeft: 4 }} />
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>{job.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{formatSalary(job.minSalary)}/hr</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{job.totalVacancies} vacancies</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
          <Text style={[styles.detailText, { color: Colors.error }]}>
            Deadline: {formatDate(job.deadline)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.employer}>{job.employer}</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  urgentBanner: {
    backgroundColor: Colors.error + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.error + '30',
  },
  urgentText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.error,
  },
  header: {
    padding: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  titleRow: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.secondary,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  details: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
  },
  employer: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.secondary,
  },
  arrowContainer: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    padding: 4,
  },
});
