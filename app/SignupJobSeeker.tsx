import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function SignupJobSeeker() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Day<Text style={{ color: '#FDB022' }}>Bee.lk</Text>
        </Text>
        <Text style={styles.title}>Job Seeker Registration</Text>
        <Text style={styles.subtitle}>
          Create your profile to find part-time jobs
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>

        {/* First Name */}
        <Text style={styles.label}>First Name *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Last Name */}
        <Text style={styles.label}>Last Name *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="male-female-outline" size={18} color="#9CA3AF" />
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" color="#9CA3AF" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* DOB */}
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="MM / DD / YYYY"
            value={dob}
            onChangeText={setDob}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* NIC */}
        <Text style={styles.label}>NIC Number *</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="card-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="123456789V or 200012345678"
            value={nic}
            onChangeText={setNic}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <View style={[styles.inputWrapper, { height: 70 }]}>
          <Ionicons name="location-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Your address"
            value={address}
            onChangeText={setAddress}
            style={[styles.input, { height: 60 }]}
            multiline
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={16} color="#111827" />
            <Text style={styles.backText}> Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => router.push('/JobSeekerRegisterStep2')}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

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

  picker: {
    flex: 1,
    marginLeft: 4,
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
});
