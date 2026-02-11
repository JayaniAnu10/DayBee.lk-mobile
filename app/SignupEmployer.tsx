import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignupEmployerStep1 = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Day<Text style={{ color: '#FDB022' }}>Bee.lk</Text>
        </Text>
        <Text style={styles.title}>Employer Registration</Text>
        <Text style={styles.subtitle}>
          Register your company to find qualified workers
        </Text>
      </View>

      
      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Company Information</Text>

        {/* Company Name */}
        <Text style={styles.label}>Company Name *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="business-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Your Company Ltd."
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* BR / NIC */}
        <Text style={styles.label}>Business Registration ID / NIC *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="card-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="e.g. PV12345678"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Contact Person */}
        <Text style={styles.label}>Contact Person Name *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="John Doe"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Phone */}
        <Text style={styles.label}>Contact Phone</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="+94 77 123 4567"
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Address */}
        <Text style={styles.label}>Company Address *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Company address"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backBtn}>
            <Ionicons name="arrow-back" size={16} color="#111827" />
            <Text style={styles.backText}> Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => navigation.navigate('EmployerRegisterStep2')}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.signIn}>Sign in</Text>
      </Text>
    </SafeAreaView>
  );
};

export default SignupEmployerStep1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 30,
    textAlign: 'center'
  },

  logoHighlight: {
    color: '#FDB022',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    color: '#111827',
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  stepWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  activeStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDB022',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeStepText: {
    fontWeight: '700',
    color: '#000',
  },

  inactiveStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inactiveStepText: {
    color: '#1F2937',
  },

  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  backText: {
    color: '#111827',
    fontWeight: '500',
  },

  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDB022',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  nextText: {
    color: '#000',
    fontWeight: '700',
    marginRight: 6,
  },

  footerText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
    color: '#6B7280',
  },

  signIn: {
    color: '#FDB022',
    fontWeight: '700',
  },
});
