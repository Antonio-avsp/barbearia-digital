import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ServicoCard from '../components/ServicoCard';
import StatusView from '../components/StatusView';
import { fetchServicos } from '../services/api';
import { colors, spacing } from '../styles/theme';

export default function ServicosScreen() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadServicos = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const data = await fetchServicos();
      setServicos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Erro inesperado ao carregar dados.');
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadServicos();
  }, [loadServicos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadServicos(true);
  }, [loadServicos]);

  const renderContent = () => {
    if (loading) return <StatusView type="loading" />;
    if (error) return <StatusView type="error" message={error} onRetry={() => loadServicos()} />;
    if (!servicos.length) return <StatusView type="empty" message="Nenhum serviço ativo encontrado." />;

    return (
      <FlatList
        data={servicos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ServicoCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="storefront-outline" size={28} color={colors.accent} />
        <View>
          <Text style={styles.title}>Barbearia Digital</Text>
          <Text style={styles.subtitle}>Serviços disponíveis</Text>
        </View>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2
  },
  listContent: {
    paddingBottom: spacing.xl
  }
});
