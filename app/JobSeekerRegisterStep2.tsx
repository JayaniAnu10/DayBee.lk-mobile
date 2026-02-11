import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const skillsList = [
  "Customer Service",
  "Data Entry",
  "Driving",
  "Cleaning",
  "Cooking",
  "Delivery",
  "Sales",
  "Marketing",
  "IT Support",
  "Teaching",
  "Accounting",
  "Photography",
  "Writing",
  "Translation",
  "Warehouse",
  "Security",
  "Receptionist",
  "Cashier",
  "Waiter/Waitress",
  "Other",
];

export default function JobSeekerRegisterStep2() {
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Day<Text style={styles.logoHighlight}>Bee.lk</Text>
          </Text>
          <Text style={styles.title}>Job Seeker Registration</Text>
          <Text style={styles.subtitle}>
            Create your profile to find part-time jobs
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Profile Picture */}
          <View style={styles.profileBox}>
            <Image
              source={{ uri: "https://via.placeholder.com/90" }}
              style={styles.profileImg}
            />
            <Text style={styles.uploadText}>Upload Photo</Text>
          </View>

          {/* Bio */}
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell employers about yourself..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={bio}
            onChangeText={setBio}
          />

          {/* Skills */}
          <Text style={styles.label}>
            Skills <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helper}>Select at least one</Text>

          <View style={styles.skillsWrapper}>
            {skillsList.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <TouchableOpacity
                  key={skill}
                  style={[styles.skillChip, active && styles.skillChipActive]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text
                    style={[styles.skillText, active && styles.skillTextActive]}
                  >
                    {skill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree && <Text style={styles.check}>✓</Text>}
            </View>
            <Text style={styles.terms}>
              I agree to the <Text style={styles.link}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (!agree || selectedSkills.length === 0) && styles.disabledBtn,
            ]}
            disabled={!agree || selectedSkills.length === 0}
          >
            <Text style={styles.primaryText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Already have an account? <Text style={styles.link}>Sign in</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },

  /* Header */
  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  logo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  logoHighlight: {
    color: "#FDB022",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  profileBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E5E7EB",
    marginBottom: 6,
  },
  uploadText: {
    color: "#FDB022",
    fontWeight: "600",
    fontSize: 13,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  required: { color: "#EF4444" },
  helper: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 10,
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    height: 90,
    backgroundColor: "#fff",
    marginBottom: 16,
    fontSize: 14,
    textAlignVertical: "top",
  },

  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  skillChip: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  skillChipActive: {
    backgroundColor: "#FDB022",
    borderColor: "#FDB022",
  },
  skillText: {
    fontSize: 12,
    color: "#374151",
  },
  skillTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FDB022",
    borderColor: "#FDB022",
  },
  check: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },
  terms: {
    fontSize: 12,
    color: "#4B5563",
  },

  primaryBtn: {
    backgroundColor: "#FDB022",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  primaryText: {
    fontWeight: "800",
    color: "#000",
    fontSize: 15,
  },

  footer: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    color: "#6B7280",
  },
  link: {
    color: "#FDB022",
    fontWeight: "700",
  },
});
