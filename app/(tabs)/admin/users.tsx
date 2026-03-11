import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
  TextInput, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { Badge } from '../../../src/components/ui/Badge';
import { Loading, EmptyState } from '../../../src/components/ui/States';

export default function AdminUsersScreen() {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const fetchUsers = async (p: number = 0, q = search) => {
    try {
      const res = await new APIClient<any>('/admin/users').getAll({ page: p, size: 20, search: q || undefined });
      const list = res?.content || res || [];
      setUsers(p === 0 ? list : (prev) => [...prev, ...list]);
      setPage(p);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleStatusToggle = (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    Alert.alert(
      `${newStatus === 'ACTIVE' ? 'Activate' : 'Suspend'} User`,
      `Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'suspend'} ${user.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm', style: newStatus === 'SUSPENDED' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await new APIClient(`/admin/users/${user.id}/status`).patch(undefined, { status: newStatus });
              setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
              Toast.show({ type: 'success', text1: `User ${newStatus.toLowerCase()}` });
            } catch {
              Toast.show({ type: 'error', text1: 'Failed to update user status' });
            }
          },
        },
      ]
    );
  };

  const handleDelete = (user: any) => {
    Alert.alert('Delete User', `Permanently delete ${user.email}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await new APIClient(`/admin/users/${user.id}`).delete();
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            Toast.show({ type: 'success', text1: 'User deleted' });
          } catch {
            Toast.show({ type: 'error', text1: 'Failed to delete user' });
          }
        },
      },
    ]);
  };

  if (loading) return <Loading fullScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by email..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={(v) => { setSearch(v); fetchUsers(0, v); }}
          />
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(0); }} tintColor={Colors.primary} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        ListEmptyComponent={<EmptyState title="No users found" icon="people-outline" />}
        onEndReached={() => fetchUsers(page + 1)}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
              <View style={styles.userMeta}>
                <Badge label={item.role} variant={item.role === 'ADMIN' ? 'error' : 'secondary'} />
                <Badge
                  label={item.status || 'ACTIVE'}
                  variant={item.status === 'SUSPENDED' ? 'error' : 'success'}
                />
              </View>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity onPress={() => handleStatusToggle(item)} style={styles.actionBtn}>
                <Ionicons
                  name={item.status === 'SUSPENDED' ? 'lock-open-outline' : 'ban-outline'}
                  size={18}
                  color={item.status === 'SUSPENDED' ? Colors.success : Colors.warning}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: Spacing.md },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, gap: Spacing.sm, height: 44,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  list: { padding: Spacing.base },
  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  userAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
  },
  userEmail: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.secondary, marginBottom: 4 },
  userMeta: { flexDirection: 'row', gap: 4 },
  userActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { padding: 4 },
});
