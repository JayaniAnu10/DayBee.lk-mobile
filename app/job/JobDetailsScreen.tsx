import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Brand colors from WelcomeScreen
const COLORS = {
  primary: "#FDB022",
  dark: "#1a1a2e",
  background: "#FFCA5D20", // subtle light yellow background
  white: "#fff",
  text: "#1a1a2e",
  textLight: "#555",
  success: "#22c55e",
};

// Job type
type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  type: string;
  category: string;
  postedDate: string;
  description: string;
  requirements: string[];
};

// 🔹 MOCK JOBS
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Junior .NET Developer",
    company: "DayBee.lk",
    location: "Colombo, Sri Lanka",
    salary: 1500,
    type: "Full-Time",
    category: "Software Development",
    postedDate: "2025-02-01",
    description: "We are looking for a Junior .NET Developer to join our team.",
    requirements: [
      "Basic knowledge of C#",
      ".NET Framework or .NET Core",
      "SQL basics",
    ],
  },
  {
    id: "2",
    title: "Frontend React Developer",
    company: "TechHive",
    location: "Kandy, Sri Lanka",
    salary: 1300,
    type: "Part-Time",
    category: "Software Development",
    postedDate: "2025-01-28",
    description:
      "Join our team as a Frontend Developer to build responsive React applications.",
    requirements: [
      "Good knowledge of React.js",
      "HTML, CSS, JavaScript",
      "Basic understanding of REST APIs",
    ],
  },
  {
    id: "3",
    title: "Digital Marketing Intern",
    company: "BrightAds",
    location: "Galle, Sri Lanka",
    salary: 500,
    type: "Internship",
    category: "Marketing",
    postedDate: "2025-02-05",
    description:
      "We are looking for a creative Digital Marketing Intern to support our campaigns.",
    requirements: [
      "Familiarity with social media platforms",
      "Basic knowledge of SEO/SEM",
      "Good communication skills",
    ],
  },
];

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      if (!id) {
        setJob(mockJobs[0]); // default first job
        return;
      }

      const jobId = Number(id);
      if (isNaN(jobId)) {
        setJob(mockJobs[0]);
        return;
      }

      const jobData = mockJobs.find((job) => Number(job.id) === jobId);
      if (!jobData) {
        setJob(mockJobs[0]);
        return;
      }

      setJob(jobData);
    } catch (error) {
      console.log("Error loading job:", error);
      setJob(mockJobs[0]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.text }}>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* JOB CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.company}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{job.type}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="location-outline"
            size={18}
            color={COLORS.textLight}
          />
          <Text style={styles.meta}>{job.location}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="cash-outline" size={18} color={COLORS.success} />
          <Text style={styles.salary}>${job.salary}/hr</Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="briefcase-outline"
            size={18}
            color={COLORS.textLight}
          />
          <Text style={styles.meta}>{job.category}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={COLORS.textLight}
          />
          <Text style={styles.meta}>
            Posted on {new Date(job.postedDate).toDateString()}
          </Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.description}>{job.description}</Text>

        {/* REQUIREMENTS */}
        {job.requirements && job.requirements.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={[styles.sectionTitle, { fontSize: 16 }]}>
              Requirements:
            </Text>
            {job.requirements.map((req, i) => (
              <Text key={i} style={styles.description}>
                • {req}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* APPLY BUTTON */}
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyText}>Apply for this Job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
  },

  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.dark,
  },

  company: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 10,
  },

  badge: {
    backgroundColor: COLORS.primary + "20",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },

  badgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  meta: {
    marginLeft: 8,
    color: COLORS.textLight,
  },

  salary: {
    marginLeft: 8,
    fontWeight: "700",
    color: COLORS.success,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.dark,
  },

  description: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 24,
  },

  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
  },

  applyText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
