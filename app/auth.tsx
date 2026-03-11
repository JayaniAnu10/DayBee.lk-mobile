import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '../src/constants/theme';
import { APIClient } from '../src/services/apiClient';
import { useAuthStore } from '../src/store/authStore';
import { apiClient } from '../src/services/apiClient';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      const res = await new APIClient<any>('/auth/login').post(loginData);
      const token = res.token;
      const me = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      await setAuth(token, me.data);
      const user = me.data;
      Toast.show({ type: 'success', text1: 'Login successful!' });
      if (user.role === 'ADMIN') {
        router.replace('/(tabs)/admin/dashboard');
      } else if (user.isEmployer) {
        router.replace('/(tabs)/employer/dashboard');
      } else if (user.isJobseeker) {
        router.replace('/(tabs)/jobseeker/dashboard');
      } else {
        router.replace('/getstarted');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Login failed. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupData.email || !signupData.password || !signupData.confirmPassword) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (signupData.password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    try {
      await new APIClient<any>('/user').post({
        email: signupData.email,
        password: signupData.password,
      });
      Toast.show({ type: 'success', text1: 'Account created! Please login.' });
      setActiveTab('login');
      setLoginData({ email: signupData.email, password: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Registration failed. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.secondary, '#1e3a5f']}
        style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>SP</Text>
          </View>
          <Text style={styles.appName}>Smart Part-Time</Text>
          <Text style={styles.tagline}>Your career starts here</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tab switcher */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'login' ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>Sign in to your account</Text>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={loginData.email}
              onChangeText={(v) => setLoginData({ ...loginData, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={loginData.password}
              onChangeText={(v) => setLoginData({ ...loginData, password: v })}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>Join Smart Part-Time today</Text>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={signupData.email}
              onChangeText={(v) => setSignupData({ ...signupData, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />
            <Input
              label="Password"
              placeholder="Create a password"
              value={signupData.password}
              onChangeText={(v) => setSignupData({ ...signupData, password: v })}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={signupData.confirmPassword}
              onChangeText={(v) => setSignupData({ ...signupData, confirmPassword: v })}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />
            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.secondary,
  },
  appName: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.white,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing.xl,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    padding: Spacing.xl,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  activeTab: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.white,
  },
  form: {
    gap: 0,
  },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
});
