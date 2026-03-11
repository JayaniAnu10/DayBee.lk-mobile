import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { Colors, FontSize, Spacing } from '../../../src/constants/theme';
import { useEmployerStore } from '../../../src/store/registrationStore';
import { Ionicons } from '@expo/vector-icons';

const INDUSTRIES = ['Retail', 'Hospitality', 'Technology', 'Healthcare', 'Education', 'Construction', 'Manufacturing', 'Food Service', 'Transportation', 'Finance', 'Other'];

export default function EmployerStep1() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, setData } = useEmployerStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showIndustries, setShowIndustries] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.companyName) newErrors.companyName = 'Company name is required';
    if (!data.registrationID) newErrors.registrationID = 'Registration ID is required';
    if (!data.contactPerson) newErrors.contactPerson = 'Contact person is required';
    if (!data.phone) newErrors.phone = 'Phone is required';
    if (!data.address) newErrors.address = 'Address is required';
    if (!data.industry) newErrors.industry = 'Industry is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          <View style={styles.stepActive}><Text style={styles.stepNum}>1</Text></View>
          <View style={styles.stepLine} />
          <View style={styles.stepInactive}><Text style={styles.stepNumInactive}>2</Text></View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Company Information</Text>
        <Text style={styles.subtitle}>Tell us about your company</Text>

        <Input
          label="Company Name"
          placeholder="Your company name"
          value={data.companyName}
          onChangeText={(v) => setData({ companyName: v })}
          error={errors.companyName}
          leftIcon="business-outline"
        />
        <Input
          label="Business Registration ID"
          placeholder="e.g. PV123456"
          value={data.registrationID}
          onChangeText={(v) => setData({ registrationID: v })}
          error={errors.registrationID}
          leftIcon="document-text-outline"
        />
        <Input
          label="Contact Person"
          placeholder="Full name"
          value={data.contactPerson}
          onChangeText={(v) => setData({ contactPerson: v })}
          error={errors.contactPerson}
          leftIcon="person-outline"
        />
        <Input
          label="Phone Number"
          placeholder="+94 77 123 4567"
          value={data.phone}
          onChangeText={(v) => setData({ phone: v })}
          error={errors.phone}
          leftIcon="call-outline"
          keyboardType="phone-pad"
        />
        <Input
          label="Address"
          placeholder="Company address"
          value={data.address}
          onChangeText={(v) => setData({ address: v })}
          error={errors.address}
          leftIcon="location-outline"
        />

        {/* Industry picker */}
        <Text style={styles.label}>Industry</Text>
        <TouchableOpacity
          style={[styles.picker, errors.industry ? styles.pickerError : null]}
          onPress={() => setShowIndustries(!showIndustries)}
        >
          <Text style={data.industry ? styles.pickerText : styles.pickerPlaceholder}>
            {data.industry || 'Select industry'}
          </Text>
          <Ionicons name={showIndustries ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
        </TouchableOpacity>
        {errors.industry && <Text style={styles.errorText}>{errors.industry}</Text>}
        {showIndustries && (
          <View style={styles.dropdown}>
            {INDUSTRIES.map((ind) => (
              <TouchableOpacity
                key={ind}
                style={[styles.dropdownItem, data.industry === ind && styles.dropdownItemActive]}
                onPress={() => { setData({ industry: ind }); setShowIndustries(false); }}
              >
                <Text style={[styles.dropdownText, data.industry === ind && styles.dropdownTextActive]}>
                  {ind}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <Button title="Next: Company Profile" onPress={() => validate() && router.push('/employer/register/step2')} fullWidth size="lg" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  backBtn: { marginBottom: Spacing.md },
  stepContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepActive: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepInactive: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepLine: { height: 2, width: 60, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: Spacing.sm },
  stepNum: { color: Colors.secondary, fontWeight: '700', fontSize: FontSize.sm },
  stepNumInactive: { color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: FontSize.sm },
  content: { padding: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.base, color: Colors.textMuted, marginBottom: Spacing.xl },
  label: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text, marginBottom: Spacing.xs },
  picker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.white, paddingHorizontal: Spacing.md, minHeight: 48,
    marginBottom: Spacing.md,
  },
  pickerError: { borderColor: Colors.error },
  pickerText: { fontSize: FontSize.base, color: Colors.text },
  pickerPlaceholder: { fontSize: FontSize.base, color: Colors.textLight },
  dropdown: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 10, marginBottom: Spacing.md, overflow: 'hidden',
  },
  dropdownItem: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  dropdownItemActive: { backgroundColor: Colors.primary + '20' },
  dropdownText: { fontSize: FontSize.base, color: Colors.text },
  dropdownTextActive: { color: Colors.secondary, fontWeight: '600' },
  errorText: { fontSize: FontSize.xs, color: Colors.error, marginTop: -Spacing.sm, marginBottom: Spacing.sm },
  footer: { padding: Spacing.base, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
});
