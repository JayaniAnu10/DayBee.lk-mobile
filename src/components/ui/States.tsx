import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing } from '../../constants/theme';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message, fullScreen = false }) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'document-outline',
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name={icon} size={56} color={Colors.textLight} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {description && <Text style={styles.emptyDescription}>{description}</Text>}
    </View>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={56} color={Colors.error} />
      <Text style={styles.emptyTitle}>Error</Text>
      <Text style={styles.emptyDescription}>{message}</Text>
      {onRetry && (
        <Text style={styles.retry} onPress={onRetry}>
          Try again
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  retry: {
    marginTop: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: '600',
  },
});
