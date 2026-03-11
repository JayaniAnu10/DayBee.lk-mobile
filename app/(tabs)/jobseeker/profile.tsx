import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, TextInput, Modal, RefreshControl,
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
import { Badge } from '../../../src/components/ui/Badge';
import { StarRating } from '../../../src/components/ui/StarRating';
import { Loading } from '../../../src/components/ui/States';

export default function JobseekerProfileScreen() {
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
        new APIClient<any>(`/jobseeker/${user.id}`).get(),
        new APIClient<any[]>(`/ratings/user/${user.id}/details`).get().catch(() => []),
      ]);
      setProfile(prof);
      setForm({ bio: prof.bio, address: prof.address, contact: prof.contact });
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
      await new APIClient(`/jobseeker/${user.id}`).patchData(form);
      Toast.show({ type: 'success', text1: 'Profile updated!' });
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.error || 'Update failed' });
    } finally { setSaving(false); }
  };

  const handlePickProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled && user?.id) {
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: result.assets[0].uri,
        name: 'profile.jpg', type: 'image/jpeg',
      } as any);
      try {
        await new APIClient(`/jobseeker/${user.id}/profile-picture`).putForm(formData);
        Toast.show({ type: 'success', text1: 'Profile picture updated!' });
        fetchProfile();
      } catch {
        Toast.show({ type: 'error', text1: 'Failed to update picture' });
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          try { await new APIClient('/auth/logout').post(); } catch { }
          await clearAuth();
          router.replace('/auth');
        },
      },
    ]);
  };

  const avgRating = ratings.length > 0
    ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
    : 0;

  if (loading) return <Loading fullScreen />;
  if (!profile) return null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(); }} tintColor={Colors.primary} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Hero */}
        <LinearGradient colors={[Colors.secondary, '#1e3a5f']} style={[styles.hero, { paddingTop: insets.top + Spacing.md }]}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickProfilePicture}>
            {profile.profilePicture ? (
              <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={36} color={Colors.white} />
              </View>
            )}
            <View style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={14} color={Colors.secondary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={Math.round(avgRating)} readonly size={18} />
            <Text style={styles.ratingText}>{avgRating.toFixed(1)} ({ratings.length} reviews)</Text>
          </View>
        </LinearGradient>

        {/* Skills */}
        {profile.skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {profile.skills.split(',').filter(Boolean).map((skill: string) => (
                <Badge key={skill} label={skill.trim()} variant="primary" />
              ))}
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>
          {[
            { icon: 'person-outline', label: 'NIC', value: profile.nic },
            { icon: 'male-female-outline', label: 'Gender', value: profile.gender },
            { icon: 'location-outline', label: 'Address', value: profile.address },
            { icon: 'call-outline', label: 'Contact', value: profile.contact },
          ].map(({ icon, label, value }) => (
            <View key={label} style={styles.infoRow}>
              <Ionicons name={icon as any} size={16} color={Colors.primary} />
              <View>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bioText}>{profile.bio || 'No bio added yet.'}</Text>
        </View>

        {/* Reviews */}
        {ratings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews ({ratings.length})</Text>
            {ratings.map((rating) => (
              <View key={rating.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <StarRating rating={rating.rating} readonly size={14} />
                  <Text style={styles.reviewDate}>
                    {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString() : ''}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>{rating.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
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
              <Input label="Bio" placeholder="Tell about yourself..." value={form.bio} onChangeText={(v) => setForm({ ...form, bio: v })} multiline numberOfLines={3} style={{ height: 80, textAlignVertical: 'top' }} />
              <Input label="Address" placeholder="Your address" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} leftIcon="location-outline" />
              <Input label="Contact Number" placeholder="Phone number" value={form.contact} onChangeText={(v) => setForm({ ...form, contact: v })} leftIcon="call-outline" keyboardType="phone-pad" />
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
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: Colors.primary },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginTop: Spacing.md },
  email: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  ratingText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  section: { backgroundColor: Colors.white, margin: Spacing.base, marginBottom: 0, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.secondary, marginBottom: Spacing.md },
  editBtn: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
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
