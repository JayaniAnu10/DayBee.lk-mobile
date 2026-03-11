import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../src/store/authStore';
import { Colors, FontSize, Spacing } from '../src/constants/theme';

export default function IndexScreen() {
  const router = useRouter();
  const { accessToken, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (accessToken && user) {
          if (user.role === 'ADMIN') {
            router.replace('/(tabs)/admin/dashboard');
          } else if (user.isEmployer) {
            router.replace('/(tabs)/employer/dashboard');
          } else if (user.isJobseeker) {
            router.replace('/(tabs)/jobseeker/dashboard');
          } else {
            router.replace('/getstarted');
          }
        } else {
          router.replace('/auth');
        }
      }, 1500);
    }
  }, [isLoading, accessToken, user]);

  return (
    <LinearGradient
      colors={[Colors.secondary, '#1e3a5f', '#2563a8']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>SP</Text>
        </View>
        <Text style={styles.appName}>Smart Part-Time</Text>
        <Text style={styles.tagline}>Find your perfect part-time job</Text>
      </View>
      <ActivityIndicator color={Colors.primary} size="large" style={styles.loader} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.secondary,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.7)',
  },
  loader: {
    marginTop: Spacing.xxxl,
  },
});
