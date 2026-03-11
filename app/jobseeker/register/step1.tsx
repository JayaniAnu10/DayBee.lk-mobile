import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { useJobSeekerStore } from '../../../src/store/registrationStore';
import { Ionicons } from '@expo/vector-icons';

const GENDERS = ['Male', 'Female', 'Other'];

export default function JobSeekerStep1() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, setData } = useJobSeekerStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';
    if (!data.nic) newErrors.nic = 'NIC is required';
    if (!data.gender) newErrors.gender = 'Gender is required';
    if (!data.address) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      router.push('/jobseeker/register/step2');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
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
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Input
              label="First Name"
              placeholder="First name"
              value={data.firstName}
              onChangeText={(v) => setData({ firstName: v })}
              error={errors.firstName}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Last Name"
              placeholder="Last name"
              value={data.lastName}
              onChangeText={(v) => setData({ lastName: v })}
              error={errors.lastName}
            />
          </View>
        </View>

        <Input
          label="NIC Number"
          placeholder="e.g. 200012345678"
          value={data.nic}
          onChangeText={(v) => setData({ nic: v })}
          error={errors.nic}
          leftIcon="card-outline"
        />

        <Input
          label="Address"
          placeholder="Your full address"
          value={data.address}
          onChangeText={(v) => setData({ address: v })}
          error={errors.address}
          leftIcon="location-outline"
          multiline
          numberOfLines={2}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderBtn, data.gender === g && styles.genderBtnActive]}
              onPress={() => setData({ gender: g })}
            >
              <Text style={[styles.genderText, data.gender === g && styles.genderTextActive]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <Button title="Next: Profile Details" onPress={handleNext} fullWidth size="lg" />
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
  backBtn: {
    marginBottom: Spacing.md,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInactive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    height: 2,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: Spacing.sm,
  },
  stepNum: {
    color: Colors.secondary,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  stepNumInactive: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  content: {
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  genderBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  genderText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  genderTextActive: {
    color: Colors.secondary,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
