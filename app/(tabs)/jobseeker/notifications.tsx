import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { useAuthStore } from '../../../src/store/authStore';
import { Loading, EmptyState } from '../../../src/components/ui/States';
import Toast from 'react-native-toast-message';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await new APIClient<any[]>(`/notifications/user/${user.id}`).get();
      setNotifications(Array.isArray(res) ? res : []);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load notifications' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAllRead = async () => {
    try {
      await new APIClient('/notifications/read-all').put();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      Toast.show({ type: 'success', text1: 'All marked as read' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update' });
    }
  };

  useEffect(() => { fetchNotifications(); }, [user?.id]);

  const onRefresh = () => { setRefreshing(true); fetchNotifications(); };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <Loading fullScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Ionicons name="notifications" size={16} color={Colors.primary} />
          <Text style={styles.unreadText}>{unreadCount} unread notifications</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        ListEmptyComponent={
          <EmptyState
            title="No notifications"
            description="You're all caught up!"
            icon="notifications-off-outline"
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}>
            <View style={[styles.notifDot, !item.isRead && styles.notifDotActive]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.notifMessage, !item.isRead && styles.notifMessageBold]}>
                {item.message}
              </Text>
              <Text style={styles.notifTime}>
                {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm') : ''}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  markAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  unreadBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary + '15', padding: Spacing.md,
    marginHorizontal: Spacing.base, marginTop: Spacing.md,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.primary + '30',
  },
  unreadText: { fontSize: FontSize.sm, color: Colors.secondary, fontWeight: '600' },
  list: { padding: Spacing.base },
  notifCard: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  notifCardUnread: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border, marginTop: 6 },
  notifDotActive: { backgroundColor: Colors.primary },
  notifMessage: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 20 },
  notifMessageBold: { fontWeight: '600', color: Colors.secondary },
  notifTime: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
});
