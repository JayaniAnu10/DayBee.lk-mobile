import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { useJobSeekerStore } from '../../../src/store/registrationStore';
import { useAuthStore } from '../../../src/store/authStore';
import { APIClient } from '../../../src/services/apiClient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function JobSeekerStep2() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, setData, reset } = useJobSeekerStore();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setData({ profilePicture: result.assets[0].uri });
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      setData({ skills: [...data.skills, trimmed] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setData({ skills: data.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async () => {
    if (!data.bio) {
      Toast.show({ type: 'error', text1: 'Bio is required' });
      return;
    }
    if (!user?.id) {
      Toast.show({ type: 'error', text1: 'Not authenticated' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('nic', data.nic);
      formData.append('gender', data.gender);
      formData.append('address', data.address);
      formData.append('bio', data.bio);
      formData.append('skills', data.skills.join(','));
      if (data.dob) formData.append('dob', data.dob.toISOString().split('T')[0]);

      if (data.profilePicture) {
        const filename = data.profilePicture.split('/').pop() || 'profile.jpg';
        formData.append('profilePicture', {
          uri: data.profilePicture,
          name: filename,
          type: 'image/jpeg',
        } as any);
      }

      await new APIClient<any>('/jobseeker/register').postForm(formData);
      
      // Refresh user from backend
      const { apiClient } = await import('../../../src/services/apiClient');
      const meRes = await apiClient.get('/auth/me');
      const { setAuth, accessToken } = useAuthStore.getState();
      if (accessToken) await setAuth(accessToken, meRes.data);

      Toast.show({ type: 'success', text1: 'Profile created successfully!' });
      reset();
      router.replace('/(tabs)/jobseeker/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Registration failed. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.stepContainer}>
          <View style={styles.stepDone}><Ionicons name="checkmark" size={16} color={Colors.white} /></View>
          <View style={styles.stepLine} />
          <View style={styles.stepActive}><Text style={styles.stepNum}>2</Text></View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Profile Details</Text>
        <Text style={styles.subtitle}>Complete your job seeker profile</Text>

        {/* Profile Picture */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {data.profilePicture ? (
            <Image source={{ uri: data.profilePicture }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera-outline" size={28} color={Colors.textMuted} />
              <Text style={styles.avatarText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Input
          label="Bio"
          placeholder="Tell employers about yourself..."
          value={data.bio}
          onChangeText={(v) => setData({ bio: v })}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        {/* Skills */}
        <Text style={styles.label}>Skills</Text>
        <View style={styles.skillInputRow}>
          <Input
            placeholder="Add a skill (e.g. Cooking)"
            value={skillInput}
            onChangeText={setSkillInput}
            containerStyle={{ flex: 1, marginBottom: 0 }}
            onSubmitEditing={addSkill}
          />
          <TouchableOpacity style={styles.addSkillBtn} onPress={addSkill}>
            <Ionicons name="add" size={22} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.skillTags}>
          {data.skills.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={styles.skillTag}
              onPress={() => removeSkill(skill)}
            >
              <Text style={styles.skillText}>{skill}</Text>
              <Ionicons name="close" size={14} color={Colors.secondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <Button
          title="Complete Registration"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  backBtn: { marginBottom: Spacing.md },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  stepActive: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepLine: {
    height: 2, width: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: Spacing.sm,
  },
  stepNum: { color: Colors.secondary, fontWeight: '700', fontSize: FontSize.sm },
  content: { padding: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.base, color: Colors.textMuted, marginBottom: Spacing.xl },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
  label: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text, marginBottom: Spacing.xs },
  skillInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  addSkillBtn: {
    width: 48, height: 48,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  skillTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  skillTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  skillText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.secondary },
  footer: {
    padding: Spacing.base, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
});
