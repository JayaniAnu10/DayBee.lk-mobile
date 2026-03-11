import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { APIClient } from '../../../src/services/apiClient';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary'];
const GENDERS = ['Any', 'Male', 'Female'];
const ACCOMMODATION = ['Provided', 'Not Provided'];

export default function PostJobScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showJobType, setShowJobType] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [schedules, setSchedules] = useState([{ startDatetime: '', endDatetime: '', requiredWorkers: 1 }]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    categoryName: '',
    location: '',
    jobType: '',
    deadline: '',
    minSalary: '',
    maxSalary: '',
    requirements: '',
    accommodation: 'Not Provided',
    latitude: 0,
    longitude: 0,
    isUrgent: false,
    requiredGender: 'Any',
  });

  useEffect(() => {
    new APIClient<any[]>('/jobs/category').get()
      .then((res) => setCategories(Array.isArray(res) ? res : []))
      .catch(() => {});
  }, []);

  const addSchedule = () => {
    setSchedules([...schedules, { startDatetime: '', endDatetime: '', requiredWorkers: 1 }]);
  };

  const removeSchedule = (idx: number) => {
    setSchedules(schedules.filter((_, i) => i !== idx));
  };

  const updateSchedule = (idx: number, field: string, value: any) => {
    setSchedules(schedules.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.categoryId || !form.location || !form.jobType || !form.deadline || !form.minSalary) {
      Toast.show({ type: 'error', text1: 'Please fill in all required fields' });
      return;
    }
    if (!user?.id) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        categoryId: parseInt(form.categoryId),
        location: form.location,
        jobType: form.jobType,
        deadline: form.deadline,
        minSalary: parseFloat(form.minSalary),
        maxSalary: parseFloat(form.maxSalary) || parseFloat(form.minSalary),
        requirements: form.requirements,
        accommodation: form.accommodation,
        schedules: schedules.filter((s) => s.startDatetime && s.endDatetime),
        latitude: form.latitude,
        longitude: form.longitude,
        isUrgent: form.isUrgent,
        requiredGender: form.requiredGender,
      };
      await new APIClient(`/jobs/create/${user.id}`).post(payload);
      Toast.show({ type: 'success', text1: 'Job posted successfully! 🎉' });
      setForm({
        title: '', description: '', categoryId: '', categoryName: '', location: '',
        jobType: '', deadline: '', minSalary: '', maxSalary: '', requirements: '',
        accommodation: 'Not Provided', latitude: 0, longitude: 0, isUrgent: false, requiredGender: 'Any',
      });
      setSchedules([{ startDatetime: '', endDatetime: '', requiredWorkers: 1 }]);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.error || 'Failed to post job' });
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
        <Text style={styles.headerTitle}>Post a Job</Text>
        <Text style={styles.headerSub}>Find the right workers for your business</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Basic Info */}
        <Text style={styles.groupTitle}>Basic Information</Text>
        <Input label="Job Title *" placeholder="e.g. Cashier, Waiter" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
        <Input label="Description *" placeholder="Describe the job..." value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline numberOfLines={4} style={{ height: 90, textAlignVertical: 'top' }} />
        <Input label="Requirements" placeholder="List requirements..." value={form.requirements} onChangeText={(v) => setForm({ ...form, requirements: v })} multiline numberOfLines={3} style={{ height: 70, textAlignVertical: 'top' }} />

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowCategories(!showCategories)}>
          <Text style={form.categoryName ? styles.pickerText : styles.pickerPlaceholder}>{form.categoryName || 'Select category'}</Text>
          <Ionicons name={showCategories ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
        </TouchableOpacity>
        {showCategories && (
          <View style={styles.dropdown}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.dropdownItem, form.categoryId === String(cat.id) && styles.dropdownItemActive]}
                onPress={() => { setForm({ ...form, categoryId: String(cat.id), categoryName: cat.name }); setShowCategories(false); }}>
                <Text style={[styles.dropdownText, form.categoryId === String(cat.id) && styles.dropdownTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Job Type */}
        <Text style={styles.label}>Job Type *</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowJobType(!showJobType)}>
          <Text style={form.jobType ? styles.pickerText : styles.pickerPlaceholder}>{form.jobType || 'Select job type'}</Text>
          <Ionicons name={showJobType ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
        </TouchableOpacity>
        {showJobType && (
          <View style={styles.dropdown}>
            {JOB_TYPES.map((t) => (
              <TouchableOpacity key={t} style={[styles.dropdownItem, form.jobType === t && styles.dropdownItemActive]}
                onPress={() => { setForm({ ...form, jobType: t }); setShowJobType(false); }}>
                <Text style={[styles.dropdownText, form.jobType === t && styles.dropdownTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Location & Salary */}
        <Text style={styles.groupTitle}>Location & Compensation</Text>
        <Input label="Location *" placeholder="e.g. Colombo, Sri Lanka" value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} leftIcon="location-outline" />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Input label="Min Salary (LKR/hr) *" placeholder="500" value={form.minSalary} onChangeText={(v) => setForm({ ...form, minSalary: v })} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Max Salary" placeholder="1000" value={form.maxSalary} onChangeText={(v) => setForm({ ...form, maxSalary: v })} keyboardType="numeric" />
          </View>
        </View>

        {/* Deadline */}
        <Input
          label="Application Deadline *"
          placeholder="YYYY-MM-DD"
          value={form.deadline}
          onChangeText={(v) => setForm({ ...form, deadline: v })}
          leftIcon="calendar-outline"
        />

        {/* Options */}
        <Text style={styles.groupTitle}>Additional Details</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Mark as Urgent</Text>
          <Switch
            value={form.isUrgent}
            onValueChange={(v) => setForm({ ...form, isUrgent: v })}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Required Gender */}
        <Text style={styles.label}>Required Gender</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowGender(!showGender)}>
          <Text style={styles.pickerText}>{form.requiredGender}</Text>
          <Ionicons name={showGender ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
        </TouchableOpacity>
        {showGender && (
          <View style={styles.dropdown}>
            {GENDERS.map((g) => (
              <TouchableOpacity key={g} style={[styles.dropdownItem, form.requiredGender === g && styles.dropdownItemActive]}
                onPress={() => { setForm({ ...form, requiredGender: g }); setShowGender(false); }}>
                <Text style={[styles.dropdownText, form.requiredGender === g && styles.dropdownTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Accommodation */}
        <Text style={styles.label}>Accommodation</Text>
        <View style={styles.chipRow}>
          {ACCOMMODATION.map((a) => (
            <TouchableOpacity key={a} style={[styles.chip, form.accommodation === a && styles.chipActive]}
              onPress={() => setForm({ ...form, accommodation: a })}>
              <Text style={[styles.chipText, form.accommodation === a && styles.chipTextActive]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Schedules */}
        <Text style={styles.groupTitle}>Work Schedules</Text>
        {schedules.map((sched, idx) => (
          <View key={idx} style={styles.scheduleBlock}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleTitle}>Schedule {idx + 1}</Text>
              {schedules.length > 1 && (
                <TouchableOpacity onPress={() => removeSchedule(idx)}>
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
            <Input label="Start Date/Time" placeholder="2024-12-01T09:00:00" value={sched.startDatetime}
              onChangeText={(v) => updateSchedule(idx, 'startDatetime', v)} />
            <Input label="End Date/Time" placeholder="2024-12-01T18:00:00" value={sched.endDatetime}
              onChangeText={(v) => updateSchedule(idx, 'endDatetime', v)} />
            <Input label="Workers Needed" placeholder="5" value={String(sched.requiredWorkers)}
              onChangeText={(v) => updateSchedule(idx, 'requiredWorkers', parseInt(v) || 1)}
              keyboardType="numeric" />
          </View>
        ))}
        <TouchableOpacity style={styles.addScheduleBtn} onPress={addSchedule}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.addScheduleText}>Add Another Schedule</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <Button title="Post Job" onPress={handleSubmit} loading={loading} fullWidth size="lg" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { padding: Spacing.base },
  groupTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.secondary, marginTop: Spacing.base, marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text, marginBottom: Spacing.xs },
  picker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.white, paddingHorizontal: Spacing.md, minHeight: 48, marginBottom: Spacing.md,
  },
  pickerText: { fontSize: FontSize.base, color: Colors.text },
  pickerPlaceholder: { fontSize: FontSize.base, color: Colors.textLight },
  dropdown: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, marginBottom: Spacing.md, overflow: 'hidden' },
  dropdownItem: { paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.md },
  dropdownItemActive: { backgroundColor: Colors.primary + '20' },
  dropdownText: { fontSize: FontSize.base, color: Colors.text },
  dropdownTextActive: { color: Colors.secondary, fontWeight: '600' },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  switchLabel: { fontSize: FontSize.base, color: Colors.text, fontWeight: '500' },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  chip: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  chipText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textMuted },
  chipTextActive: { color: Colors.secondary },
  scheduleBlock: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  scheduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  scheduleTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.secondary },
  addScheduleBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed', justifyContent: 'center', marginBottom: Spacing.md },
  addScheduleText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: '600' },
  footer: { padding: Spacing.base, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
});
