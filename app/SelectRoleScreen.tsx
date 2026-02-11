import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Briefcase, User } from 'lucide-react-native';




const SelectRoleScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF7E6']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Briefcase size={26} color="#fff" />
          </View>
          <Text style={styles.logoText}>
            Day<Text style={styles.logoHighlight}>Bee</Text>
          </Text>
        </View>

        <Text style={styles.title}>
          Select how you want to use our platform
        </Text>

        {/* Job Seeker */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/SignupJobSeeker')}
        >
          <View style={styles.iconCircle}>
            <User size={28} color="#F59E0B" />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>I'm a Job Seeker</Text>
            <Text style={styles.cardDesc}>
              Find flexible part-time jobs in Sri Lanka
            </Text>
            <Text style={styles.getStarted}>Get Started →</Text>
          </View>
        </TouchableOpacity>

        {/* Employer */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/SignupEmployer')}
        >
          <View style={styles.iconCircle}>
            <Briefcase size={28} color="#F59E0B" />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>I'm an Employer</Text>
            <Text style={styles.cardDesc}>
              Post jobs and find qualified candidates
            </Text>
            <Text style={styles.getStarted}>Get Started →</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SelectRoleScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
     alignItems: 'center', 
     marginTop: 60, 
     marginBottom: 30 ,
  },

  logoBox: {
    backgroundColor: '#FDB022',
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
  },

  logoText: {
    fontSize: 32, 
    fontWeight: '800', 
    color: '#1a1a2e'
  },

  logoHighlight: {
    color: '#FDB022',
  },

  title: {
     fontSize: 16, 
     color: '#475467', 
     marginTop: 1,
     marginBottom:15,
     
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 35
  },

  iconCircle: {
    backgroundColor: '#FFF4D6',
    padding: 14,
    borderRadius: 50,
    marginRight: 16,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  cardDesc: {
    fontSize: 14,
    color: '#64748B',
    marginVertical: 4,
  },

  getStarted: {
    marginTop: 6,
    color: '#FDB022',
    fontWeight: '600',
  },
});
