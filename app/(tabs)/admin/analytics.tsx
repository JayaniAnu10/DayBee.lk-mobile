import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { Loading } from '../../../src/components/ui/States';

export default function AdminAnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [overview, setOverview] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [ov, cats, locs] = await Promise.all([
        new APIClient<any>('/admin/analytics/overview').get(),
        new APIClient<any[]>('/admin/analytics/top-categories').get().catch(() => []),
        new APIClient<any[]>('/admin/analytics/jobs-by-location').get().catch(() => []),
      ]);
      setOverview(ov);
      setCategories(Array.isArray(cats) ? cats.slice(0, 10) : []);
      setLocationData(Array.isArray(locs) ? locs.slice(0, 10) : []);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Loading fullScreen />;

  const maxCatCount = categories.length > 0 ? Math.max(...categories.map((c) => c.count || 0)) : 1;
  const maxLocCount = locationData.length > 0 ? Math.max(...locationData.map((l) => l.count || 0)) : 1;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSub}>Platform performance overview</Text>
      </View>

      {/* Overview stats */}
      {overview && (
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Users', value: overview.totalUsers || 0, icon: 'people-outline', color: Colors.info },
            { label: 'Job Seekers', value: overview.totalJobSeekers || 0, icon: 'person-outline', color: Colors.success },
            { label: 'Employers', value: overview.totalEmployers || 0, icon: 'business-outline', color: Colors.warning },
            { label: 'Active Jobs', value: overview.activeJobs || 0, icon: 'briefcase-outline', color: Colors.primary },
            { label: 'Applications', value: overview.totalApplications || 0, icon: 'document-text-outline', color: Colors.secondary },
            { label: 'Revenue', value: `$${overview.totalRevenue || 0}`, icon: 'cash-outline', color: Colors.success },
          ].map(({ label, value, icon, color }) => (
            <View key={label} style={[styles.statCard, { width: '48%' }]}>
              <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon as any} size={20} color={color} />
              </View>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Top Categories */}
      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jobs by Category</Text>
          {categories.map((cat, idx) => (
            <View key={idx} style={styles.barRow}>
              <Text style={styles.barLabel} numberOfLines={1}>{cat.category || cat.name}</Text>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${((cat.count || 0) / maxCatCount) * 100}%` }]} />
              </View>
              <Text style={styles.barValue}>{cat.count || 0}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Jobs by Location */}
      {locationData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jobs by Location</Text>
          {locationData.map((loc, idx) => (
            <View key={idx} style={styles.barRow}>
              <Text style={styles.barLabel} numberOfLines={1}>{loc.location || loc.city}</Text>
              <View style={[styles.barContainer, { flex: 1 }]}>
                <View style={[styles.barFill, { width: `${((loc.count || 0) / maxLocCount) * 100}%`, backgroundColor: Colors.info }]} />
              </View>
              <Text style={styles.barValue}>{loc.count || 0}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.base, gap: Spacing.sm },
  statCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  statIcon: { width: 40, height: 40, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  section: { backgroundColor: Colors.white, margin: Spacing.base, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.secondary, marginBottom: Spacing.lg },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  barLabel: { width: 90, fontSize: FontSize.xs, color: Colors.text, fontWeight: '500' },
  barContainer: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  barValue: { width: 30, fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'right', fontWeight: '600' },
});
