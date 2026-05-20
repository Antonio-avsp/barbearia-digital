import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

export default function ServicoCard({ item }) {
  const { width } = useWindowDimensions();
  const compact = width < 360;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name="content-cut" size={22} color={colors.accent} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.nome}</Text>
        {!!item.descricao && <Text style={styles.description}>{item.descricao}</Text>}

        <View style={styles.metaRow}>
          <Text style={styles.price}>R$ {Number(item.preco).toFixed(2)}</Text>
          <Text style={styles.duration}>{item.duracaoMinutos} min</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceAlt
  },
  cardCompact: {
    padding: spacing.sm
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E1A2F'
  },
  info: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700'
  },
  description: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  price: {
    color: colors.accent,
    fontWeight: '700'
  },
  duration: {
    color: colors.muted,
    fontWeight: '600'
  }
});
