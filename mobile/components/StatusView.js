import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

export default function StatusView({ type = 'loading', message, onRetry }) {
  if (type === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.message}>{message || 'Carregando serviços...'}</Text>
      </View>
    );
  }

  const iconName = type === 'error' ? 'alert-circle-outline' : 'inbox-outline';
  const iconColor = type === 'error' ? colors.danger : colors.muted;

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={iconName} size={42} color={iconColor} />
      <Text style={styles.message}>{message}</Text>
      {type === 'error' && onRetry ? (
        <Text style={styles.retry} onPress={onRetry}>
          Tentar novamente
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm
  },
  message: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 16
  },
  retry: {
    marginTop: spacing.xs,
    color: colors.accent,
    fontWeight: '600'
  }
});
