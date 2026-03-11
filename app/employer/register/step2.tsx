import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { Colors, FontSize, Spacing } from '../../../src/constants/theme';
import { useEmployerStore } from '../../../src/store/registrationStore';
import { useAuthStore } from '../../../src/store/authStore';
import { APIClient, apiClient } from '../../../src/services/apiClient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function EmployerStep2() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, setData, reset } = useEmployerStore();
  const user = useAuthStore((s) => s.user);
  const { accessToken, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setData({ logo: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!data.description) {
      Toast.show({ type: 'error', text1: 'Description is required' });
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
      formData.append('companyName', data.companyName);
      formData.append('registrationID', data.registrationID);
      formData.append('contactPerson', data.contactPerson);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('industry', data.industry);
      formData.append('website', data.website || '');
      formData.append('description', data.description);
      if (data.logo) {
        const filename = data.logo.split('/').pop() || 'logo.jpg';
        formData.append('logo', { uri: data.logo, name: filename, type: 'image/jpeg' } as any);
      }
      await new APIClient<any>('/employer/register').postForm(formData);
      const meRes = await apiClient.get('/auth/me');
      if (accessToken) await setAuth(accessToken, meRes.data);
      Toast.show({ type: 'success', text1: 'Company registered successfully!' });
      reset();
      router.replace('/(tabs)/employer/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Registration failed.';
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
          <View style={[styles.stepLine, { backgroundColor: Colors.primary + '60' }]} />
          <View style={styles.stepActive}><Text style={styles.stepNum}>2</Text></View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Company Profile</Text>
        <Text style={styles.subtitle}>Add your company details</Text>

        <TouchableOpacity style={styles.logoContainer} onPress={pickLogo}>
          {data.logo ? (
            <Image source={{ uri: data.logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Ionicons name="image-outline" size={28} color={Colors.textMuted} />
              <Text style={styles.logoText}>Upload Logo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Input
          label="Company Description"
          placeholder="Describe your company..."
          value={data.description}
          onChangeText={(v) => setData({ description: v })}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />
        <Input
          label="Website (Optional)"
          placeholder="https://yourcompany.com"
          value={data.website}
          onChangeText={(v) => setData({ website: v })}
          leftIcon="globe-outline"
          keyboardType="url"
          autoCapitalize="none"
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <Button title="Complete Registration" onPress={handleSubmit} loading={loading} fullWidth size="lg" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  backBtn: { marginBottom: Spacing.md },
  stepContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepDone: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  stepActive: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepLine: { height: 2, width: 60, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: Spacing.sm },
  stepNum: { color: Colors.secondary, fontWeight: '700', fontSize: FontSize.sm },
  content: { padding: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.base, color: Colors.textMuted, marginBottom: Spacing.xl },
  logoContainer: { alignSelf: 'center', marginBottom: Spacing.xl },
  logo: { width: 100, height: 100, borderRadius: 16, borderWidth: 3, borderColor: Colors.primary },
  logoPlaceholder: {
    width: 100, height: 100, borderRadius: 16,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
  footer: { padding: Spacing.base, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
});
