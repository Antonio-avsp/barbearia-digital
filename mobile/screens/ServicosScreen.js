import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ServicoCard from '../components/ServicoCard';
import ServicoForm from '../components/ServicoForm';
import StatusView from '../components/StatusView';
import { createServico, deleteServico, fetchServicos, updateServico } from '../services/api';
import { colors, spacing } from '../styles/theme';

function confirmar(titulo, mensagem, onConfirm) {
  if (Platform.OS === 'web') {
    // Alert.alert não exibe botões no web
    if (window.confirm(`${titulo}\n\n${mensagem}`)) onConfirm();
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: onConfirm }
  ]);
}

export default function ServicosScreen() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [servicoEmEdicao, setServicoEmEdicao] = useState(null);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(''), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadServicos(true);
  }, [loadServicos]);

  const abrirCadastro = () => {
    setServicoEmEdicao(null);
    setFormVisible(true);
  };

  const abrirEdicao = (servico) => {
    setServicoEmEdicao(servico);
    setFormVisible(true);
  };

  const handleSubmit = async (dados) => {
    setSaving(true);
    try {
      if (servicoEmEdicao) {
        await updateServico(servicoEmEdicao._id, dados);
        setFeedback('Serviço atualizado com sucesso!');
      } else {
        await createServico(dados);
        setFeedback('Serviço cadastrado com sucesso!');
      }
      setFormVisible(false);
      setServicoEmEdicao(null);
      await loadServicos(true);
    } catch (err) {
      setFeedback(err.message || 'Erro ao salvar serviço.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (servico) => {
    confirmar('Excluir serviço', `Deseja excluir "${servico.nome}"?`, async () => {
      try {
        await deleteServico(servico._id);
        setFeedback('Serviço excluído com sucesso!');
        await loadServicos(true);
      } catch (err) {
        setFeedback(err.message || 'Erro ao excluir serviço.');
      }
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <StatusView
          type="loading"
          message={'Carregando serviços...\nO servidor gratuito pode levar até 1 minuto para acordar no primeiro acesso.'}
        />
      );
    }
    if (error) return <StatusView type="error" message={error} onRetry={() => loadServicos()} />;
    if (!servicos.length) {
      return (
        <StatusView
          type="empty"
          message="Nenhum serviço cadastrado. Toque em + para adicionar o primeiro."
        />
      );
    }

    return (
      <FlatList
        data={servicos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ServicoCard item={item} onEdit={abrirEdicao} onDelete={handleDelete} />
        )}
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
          <Text style={styles.subtitle}>Gerencie os serviços da barbearia</Text>
        </View>
      </View>

      {!!feedback && (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      )}

      {renderContent()}

      <Pressable style={styles.fab} onPress={abrirCadastro}>
        <MaterialCommunityIcons name="plus" size={28} color={colors.background} />
      </Pressable>

      <ServicoForm
        visible={formVisible}
        servico={servicoEmEdicao}
        saving={saving}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormVisible(false);
          setServicoEmEdicao(null);
        }}
      />
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
  feedback: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent
  },
  feedbackText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600'
  },
  listContent: {
    paddingBottom: spacing.xl * 3
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  }
});
