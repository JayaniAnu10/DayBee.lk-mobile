import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.logoText}>
            <Ionicons name="briefcase" size={32} color="#FDB022" /> Day<Text style={{color: '#FDB022'}}>Bee</Text>
          </Text>
          <Text style={styles.subHeader}>Welcome back! Login to continue</Text>
        </View>

        {/* Card Section */}
        <View style={styles.card}>

          {/* Form Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Bottom Link */}
          <TouchableOpacity 
  style={styles.signupLink} 
  onPress={() => router.push('/RegisterScreen')}
>
  <Text style={styles.signupText}>
    Don't have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
  </Text>
</TouchableOpacity>

</View>

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContainer: { paddingBottom: 40, paddingHorizontal: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  logoText: { fontSize: 32, fontWeight: '800', color: '#1a1a2e', flexDirection: 'row', alignItems: 'center' },
  subHeader: { fontSize: 16, color: '#475467', marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E4E7EC', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#344054', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#101828' },
  loginButton: { backgroundColor: '#FDB022', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#0b0b0b', fontSize: 16, fontWeight: '700' },
  signupLink: { alignItems: 'center', paddingVertical: 12, marginTop: 10 },
  signupText: { color: '#1a1a2e', fontSize: 14, fontWeight: '600' },
  signupHighlight: { color: '#FDB022', fontWeight: '700' },
  footerText: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#667085' },
  linkText: { color: '#FDB022', fontWeight: '600' },
});

export default LoginScreen;
