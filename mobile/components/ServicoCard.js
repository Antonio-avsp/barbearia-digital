import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

export default function ServicoCard({ item, onEdit, onDelete }) {
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const inativo = item.ativo === false;

  return (
    <View style={[styles.card, compact && styles.cardCompact, inativo && styles.cardInativo]}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name="content-cut" size={22} color={colors.accent} />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.nome}</Text>
          {inativo && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Inativo</Text>
            </View>
          )}
        </View>
        {!!item.descricao && <Text style={styles.description}>{item.descricao}</Text>}

        <View style={styles.metaRow}>
          <Text style={styles.price}>R$ {Number(item.preco).toFixed(2)}</Text>
          <Text style={styles.duration}>{item.duracaoMinutos} min</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => onEdit?.(item)} hitSlop={8} style={styles.actionButton}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.accent} />
        </Pressable>
        <Pressable onPress={() => onDelete?.(item)} hitSlop={8} style={styles.actionButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
        </Pressable>
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
  cardInativo: {
    opacity: 0.65
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap'
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700'
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeText: {
    color: colors.muted,
    fontSize: 11,
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
  },
  actions: {
    justifyContent: 'center',
    gap: spacing.sm
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt
  }
});
