import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badge_primary: {
    backgroundColor: Colors.primary + '25',
  },
  badge_secondary: {
    backgroundColor: Colors.secondary + '15',
  },
  badge_success: {
    backgroundColor: Colors.success + '20',
  },
  badge_warning: {
    backgroundColor: Colors.warning + '25',
  },
  badge_error: {
    backgroundColor: Colors.error + '20',
  },
  badge_info: {
    backgroundColor: Colors.info + '20',
  },
  badge_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  text_primary: {
    color: '#a0720f',
  },
  text_secondary: {
    color: Colors.secondary,
  },
  text_success: {
    color: '#15803d',
  },
  text_warning: {
    color: '#92400e',
  },
  text_error: {
    color: '#991b1b',
  },
  text_info: {
    color: '#1d4ed8',
  },
  text_outline: {
    color: Colors.textMuted,
  },
});
