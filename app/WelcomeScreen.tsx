import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  // Pulse animations
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;

  const createPulseAnimation = (value: Animated.Value, delay = 0) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1.1,
          duration: 2000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
  };

  useEffect(() => {
    StatusBar.setHidden(true, 'fade');

    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const p1 = createPulseAnimation(pulse1, 0);
    const p2 = createPulseAnimation(pulse2, 1000);
    const p3 = createPulseAnimation(pulse3, 2000);

    p1.start();
    p2.start();
    p3.start();

    return () => {
      p1.stop();
      p2.stop();
      p3.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FDB022', '#FFCA5D']}
        style={styles.gradient}
      >
        {/* Decorative circles */}
        <Animated.View style={[styles.decoCircle, styles.c1, { transform: [{ scale: pulse1 }] }]} />
        <Animated.View style={[styles.decoCircle, styles.c2, { transform: [{ scale: pulse2 }] }]} />
        <Animated.View style={[styles.decoCircle, styles.c3, { transform: [{ scale: pulse3 }] }]} />

        {/* Logo */}
        <View style={styles.topSection}>
          <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoScale }}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🐝</Text>
            </View>
            <Text style={styles.brandName}>
              Day<Text style={styles.brandHighlight}>Bee</Text>
            </Text>
            <Text style={styles.brandDomain}>.lk</Text>
          </Animated.View>
        </View>

        {/* Text Section */}
        <Animated.View
          style={[
            styles.middleSection,
            { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
          ]}
        >
          <Text style={styles.tagline}>Find Your Perfect</Text>
          <Text style={styles.taglineHighlight}>Part-Time Job</Text>
          <Text style={styles.subTagline}>
            Connect with thousands of flexible opportunities in Sri Lanka
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push('/LoginScreen')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          
        </Animated.View>
      </LinearGradient>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },

  topSection: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  logoIcon: { fontSize: 40 },

  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },

  brandHighlight: { color: '#1a1a2e' },

  brandDomain: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginTop: -8,
    textAlign: 'center',
  },

  middleSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  tagline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },

  taglineHighlight: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 16,
  },

  subTagline: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },

  bottomSection: {
    flex: 0.25,
    justifyContent: 'flex-end',
    paddingBottom: 50,
    alignItems: 'center',
  },

  getStartedButton: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 20,
  },

  getStartedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 8,
  },

  arrow: { color: '#FDB022', fontSize: 25 },

  loginText: { color: '#fff', fontSize: 14 },

  loginHighlight: { color: '#1a1a2e', fontWeight: '700' },

  decoCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  c1: { width: 100, height: 100, top: '10%', right: -20 },
  c2: { width: 150, height: 150, bottom: '15%', left: -50 },
  c3: { width: 80, height: 80, top: '40%', left: -20 },
});

export default WelcomeScreen;
