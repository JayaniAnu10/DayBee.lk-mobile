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
import { Ionicons } from '@expo/vector-icons'; // Icon ekata useful
import { Picker } from '@react-native-picker/picker'; // Dropdown ekata
import { LinearGradient } from 'expo-linear-gradient';


const RegisterScreen = () => {
  const router = useRouter();
  const [role, setRole] = useState('Job Seeker');

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
          <Text style={styles.subHeader}>Join thousands of job seekers</Text>
        </View>

        {/* Card Section */}
        <View style={styles.card}>

          {/* Form Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="John Doe" 
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="you@example.com" 
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>I am a</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Job Seeker" value="Job Seeker" />
                <Picker.Item label="Employer" value="Employer" />
              </Picker>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Already have an account?{' '}
          
          <Text 
            style={styles.linkText} 
            onPress={() => router.push('/LoginScreen')}
          >
            Login
          </Text>
        </Text>

        <Text style={styles.footerText}>
          By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#475467',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#101828',
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  createButton: {
    backgroundColor: '#FDB022',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#141414',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#667085',
  },
  linkText: {
    color: '#FDB022',
    fontWeight: '600',
  },
});

export default RegisterScreen;
