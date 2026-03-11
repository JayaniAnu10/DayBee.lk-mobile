import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, Modal, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';
import { useAuthStore } from '../../../src/store/authStore';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { Loading } from '../../../src/components/ui/States';
import { StarRating } from '../../../src/components/ui/StarRating';

export default function EmployerProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [profile, setProfile] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const [prof, rats] = await Promise.all([
        new APIClient<any>(`/employer/${user.id}`).get(),
        new APIClient<any[]>(`/ratings/user/${user.id}/details`).get().catch(() => []),
      ]);
      setProfile(prof);
      setForm({ description: prof.description, website: prof.website, phone: prof.phone, address: prof.address });
      setRatings(Array.isArray(rats) ? rats : []);
    } catch { } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await new APIClient(`/employer/${user.id}`).patchData(form);
      Toast.show({ type: 'success', text1: 'Profile updated!' });
      setEditing(false);
      fetchProfile();
    } catch {
      Toast.show({ type: 'error', text1: 'Update failed' });
    } finally { setSaving(false); }
  };

  const handlePickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled && user?.id) {
      const formData = new FormData();
      formData.append('logo', { uri: result.assets[0].uri, name: 'logo.jpg', type: 'image/jpeg' } as any);
      try {
        await new APIClient(`/employer/${user.id}/logo`).putForm(formData);
        Toast.show({ type: 'success', text1: 'Logo updated!' });
        fetchProfile();
      } catch { Toast.show({ type: 'error', text1: 'Failed to update logo' }); }
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        try { await new APIClient('/auth/logout').post(); } catch { }
        await clearAuth(); router.replace('/auth');
      }},
    ]);
  };

  const avgRating = ratings.length > 0
    ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;

  if (loading) return <Loading fullScreen />;
  if (!profile) return null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(); }} tintColor={Colors.primary} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <LinearGradient colors={[Colors.secondary, '#1e3a5f']} style={[styles.hero, { paddingTop: insets.top + Spacing.md }]}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickLogo}>
            {profile.logo ? (
              <Image source={{ uri: profile.logo }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="business" size={36} color={Colors.white} />
              </View>
            )}
            <View style={styles.editLogoBtn}>
              <Ionicons name="camera" size={14} color={Colors.secondary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.companyName}>{profile.companyName}</Text>
          <Text style={styles.industry}>{profile.industry}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={Math.round(avgRating)} readonly size={16} />
            <Text style={styles.ratingText}>{avgRating.toFixed(1)} ({ratings.length} reviews)</Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Company Information</Text>
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>
          {[
            { icon: 'card-outline', label: 'Registration ID', value: profile.registrationID },
            { icon: 'person-outline', label: 'Contact Person', value: profile.contactPerson },
            { icon: 'call-outline', label: 'Phone', value: profile.phone },
            { icon: 'location-outline', label: 'Address', value: profile.address },
            { icon: 'globe-outline', label: 'Website', value: profile.website },
          ].map(({ icon, label, value }) => (
            <View key={label} style={styles.infoRow}>
              <Ionicons name={icon as any} size={16} color={Colors.primary} />
              <View><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value || 'Not provided'}</Text></View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { marginTop: Spacing.md }]}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.bioText}>{profile.description || 'No description added yet.'}</Text>
        </View>

        {ratings.length > 0 && (
          <View style={[styles.section, { marginTop: Spacing.md }]}>
            <Text style={styles.sectionTitle}>Reviews ({ratings.length})</Text>
            {ratings.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <StarRating rating={r.rating} readonly size={14} />
                  <Text style={styles.reviewDate}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</Text>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={editing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.base }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Input label="Description" placeholder="About your company..." value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} />
              <Input label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} leftIcon="call-outline" keyboardType="phone-pad" />
              <Input label="Address" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} leftIcon="location-outline" />
              <Input label="Website" value={form.website} onChangeText={(v) => setForm({ ...form, website: v })} leftIcon="globe-outline" keyboardType="url" autoCapitalize="none" />
            </ScrollView>
            <Button title="Save Changes" onPress={handleSave} loading={saving} fullWidth size="lg" style={{ marginTop: Spacing.base }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl, position: 'relative' },
  logoutBtn: { alignSelf: 'flex-end', padding: Spacing.sm, marginBottom: Spacing.md },
  logo: { width: 90, height: 90, borderRadius: 16, borderWidth: 3, borderColor: Colors.primary },
  logoPlaceholder: { width: 90, height: 90, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  editLogoBtn: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  companyName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginTop: Spacing.md },
  industry: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  ratingText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  section: { backgroundColor: Colors.white, margin: Spacing.base, marginBottom: 0, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.secondary, marginBottom: Spacing.md },
  editBtn: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  infoRow: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  infoValue: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text, marginTop: 2 },
  bioText: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 20 },
  reviewCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  reviewDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  reviewComment: { fontSize: FontSize.sm, color: Colors.text },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.xl, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.secondary },
});
