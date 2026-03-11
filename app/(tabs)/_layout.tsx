import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user);
  
  if (!user) return null;

  if (user.role === 'ADMIN') {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: { backgroundColor: Colors.secondary, borderTopColor: 'rgba(255,255,255,0.1)' },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="admin/dashboard"
          options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="admin/users"
          options={{ title: 'Users', tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="admin/jobs"
          options={{ title: 'Jobs', tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="admin/complaints"
          options={{ title: 'Reports', tabBarIcon: ({ color, size }) => <Ionicons name="flag-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="shared/chat"
          options={{ title: 'AI Chat', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} /> }}
        />
        {/* Hidden screens */}
        <Tabs.Screen name="admin/analytics" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/dashboard" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/find-jobs" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/notifications" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/profile" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/history" options={{ href: null }} />
        <Tabs.Screen name="employer/dashboard" options={{ href: null }} />
        <Tabs.Screen name="employer/post-job" options={{ href: null }} />
        <Tabs.Screen name="employer/profile" options={{ href: null }} />
        <Tabs.Screen name="shared/find-jobs" options={{ href: null }} />
        <Tabs.Screen name="shared/job-detail" options={{ href: null }} />
        <Tabs.Screen name="shared/nearby" options={{ href: null }} />
      </Tabs>
    );
  }

  if (user.role === 'USER') {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: { backgroundColor: Colors.secondary, borderTopColor: 'rgba(255,255,255,0.1)' },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="employer/dashboard"
          options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="employer/post-job"
          options={{ title: 'Post Job', tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="shared/find-jobs"
          options={{ title: 'Jobs', tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="shared/chat"
          options={{ title: 'AI Chat', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="employer/profile"
          options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
        />
        {/* Hidden screens */}
        <Tabs.Screen name="jobseeker/dashboard" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/find-jobs" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/notifications" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/profile" options={{ href: null }} />
        <Tabs.Screen name="jobseeker/history" options={{ href: null }} />
        <Tabs.Screen name="admin/dashboard" options={{ href: null }} />
        <Tabs.Screen name="admin/users" options={{ href: null }} />
        <Tabs.Screen name="admin/jobs" options={{ href: null }} />
        <Tabs.Screen name="admin/complaints" options={{ href: null }} />
        <Tabs.Screen name="admin/analytics" options={{ href: null }} />
        <Tabs.Screen name="shared/job-detail" options={{ href: null }} />
        <Tabs.Screen name="shared/nearby" options={{ href: null }} />
      </Tabs>
    );
  }

  // JOBSEEKER
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: { backgroundColor: Colors.secondary, borderTopColor: 'rgba(255,255,255,0.1)' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="jobseeker/dashboard"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="jobseeker/find-jobs"
        options={{ title: 'Find Jobs', tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="jobseeker/notifications"
        options={{ title: 'Alerts', tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="shared/chat"
        options={{ title: 'AI Chat', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="jobseeker/profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="jobseeker/history" options={{ href: null }} />
      <Tabs.Screen name="employer/dashboard" options={{ href: null }} />
      <Tabs.Screen name="employer/post-job" options={{ href: null }} />
      <Tabs.Screen name="employer/profile" options={{ href: null }} />
      <Tabs.Screen name="admin/dashboard" options={{ href: null }} />
      <Tabs.Screen name="admin/users" options={{ href: null }} />
      <Tabs.Screen name="admin/jobs" options={{ href: null }} />
      <Tabs.Screen name="admin/complaints" options={{ href: null }} />
      <Tabs.Screen name="admin/analytics" options={{ href: null }} />
      <Tabs.Screen name="shared/find-jobs" options={{ href: null }} />
      <Tabs.Screen name="shared/job-detail" options={{ href: null }} />
      <Tabs.Screen name="shared/nearby" options={{ href: null }} />
    </Tabs>
  );
}