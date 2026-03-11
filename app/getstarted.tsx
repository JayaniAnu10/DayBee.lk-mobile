import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../src/constants/theme';
import { useAuthStore } from '../src/store/authStore';

export default function GetStartedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    await clearAuth();
    router.replace('/auth');
  };

  return (
    <LinearGradient
      colors={[Colors.secondary, '#1e3a5f', '#2a4a7f']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>SP</Text>
        <Text style={styles.appName}>Smart Part-Time</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subtitle}>Choose your role to get started</Text>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => router.push('/jobseeker/register/step1')}
          activeOpacity={0.85}
        >
          <View style={styles.roleIcon}>
            <Ionicons name="briefcase-outline" size={32} color={Colors.primary} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Job Seeker</Text>
            <Text style={styles.roleDesc}>Find part-time opportunities near you</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => router.push('/employer/register/step1')}
          activeOpacity={0.85}
        >
          <View style={[styles.roleIcon, { backgroundColor: Colors.secondary + '30' }]}>
            <Ionicons name="business-outline" size={32} color={Colors.white} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Employer</Text>
            <Text style={styles.roleDesc}>Post jobs and find talented workers</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
  },
  appName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xxl,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.secondary,
  },
  roleDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.md,
  },
  logoutText: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
