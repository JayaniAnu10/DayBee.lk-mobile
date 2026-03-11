import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { format } from 'date-fns';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { Badge } from '../../../src/components/ui/Badge';
import { Button } from '../../../src/components/ui/Button';
import { Loading, EmptyState } from '../../../src/components/ui/States';

export default function AdminComplaintsScreen() {
  const insets = useSafeAreaInsets();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED' | 'DISMISSED'>('ALL');

  const fetchComplaints = async () => {
    try {
      const res = await new APIClient<any>('/admin/complaints').getAll({ page: 0, size: 50 });
      setComplaints(res?.content || res || []);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await new APIClient(`/admin/complaints/${id}/status`).put({ status });
      setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
      setSelected(null);
      Toast.show({ type: 'success', text1: `Complaint ${status.toLowerCase()}` });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update status' });
    }
  };

  const filtered = filter === 'ALL' ? complaints : complaints.filter((c) => c.status === filter);

  if (loading) return <Loading fullScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Review Reports</Text>
        <View style={styles.filterRow}>
          {(['ALL', 'OPEN', 'RESOLVED'] as const).map((f) => (
            <TouchableOpacity key={f} style={[styles.filterTab, filter === f && styles.filterTabActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchComplaints(); }} tintColor={Colors.primary} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        ListEmptyComponent={<EmptyState title="No complaints" icon="flag-outline" />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.complaintCard} onPress={() => setSelected(item)}>
            <View style={styles.cardHeader}>
              <Text style={styles.subject} numberOfLines={1}>{item.subject || item.type}</Text>
              <Badge
                label={item.status || 'OPEN'}
                variant={item.status === 'RESOLVED' ? 'success' : item.status === 'DISMISSED' ? 'outline' : 'warning'}
              />
            </View>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            {item.createdAt && (
              <Text style={styles.date}>{format(new Date(item.createdAt), 'MMM dd, yyyy')}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.base }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Details</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            {selected && (
              <>
                <Badge label={selected.status || 'OPEN'} variant={selected.status === 'RESOLVED' ? 'success' : 'warning'} style={{ alignSelf: 'flex-start', marginBottom: Spacing.md }} />
                <Text style={styles.detailLabel}>Subject</Text>
                <Text style={styles.detailValue}>{selected.subject || selected.type}</Text>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{selected.description}</Text>
                {selected.createdAt && (
                  <>
                    <Text style={styles.detailLabel}>Submitted</Text>
                    <Text style={styles.detailValue}>{format(new Date(selected.createdAt), 'MMMM dd, yyyy HH:mm')}</Text>
                  </>
                )}
                {selected.status !== 'RESOLVED' && (
                  <View style={styles.modalActions}>
                    <Button title="Resolve" onPress={() => updateStatus(selected.id, 'RESOLVED')} style={{ flex: 1, marginRight: Spacing.sm }} />
                    <Button title="Dismiss" variant="outline" onPress={() => updateStatus(selected.id, 'DISMISSED')} style={{ flex: 1 }} />
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: Spacing.md },
  filterRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: BorderRadius.lg, padding: 2 },
  filterTab: { flex: 1, paddingVertical: Spacing.sm - 2, alignItems: 'center', borderRadius: BorderRadius.md },
  filterTabActive: { backgroundColor: Colors.primary },
  filterTabText: { fontSize: FontSize.sm, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  filterTabTextActive: { color: Colors.secondary },
  list: { padding: Spacing.base },
  complaintCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xs },
  subject: { flex: 1, fontSize: FontSize.base, fontWeight: '700', color: Colors.secondary, marginRight: Spacing.sm },
  description: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.xs },
  date: { fontSize: FontSize.xs, color: Colors.textLight },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.xl, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.secondary },
  detailLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMuted, marginTop: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: FontSize.base, color: Colors.text, marginTop: Spacing.xs, lineHeight: 22 },
  modalActions: { flexDirection: 'row', marginTop: Spacing.xl, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
});
