import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

const FORM_VAZIO = {
  nome: '',
  descricao: '',
  preco: '',
  duracaoMinutos: '',
  ativo: true
};

export default function ServicoForm({ visible, servico, saving, onSubmit, onClose }) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [errors, setErrors] = useState({});

  const editando = !!servico;

  useEffect(() => {
    if (!visible) return;

    setErrors({});
    setForm(
      servico
        ? {
            nome: servico.nome ?? '',
            descricao: servico.descricao ?? '',
            preco: String(servico.preco ?? ''),
            duracaoMinutos: String(servico.duracaoMinutos ?? ''),
            ativo: servico.ativo !== false
          }
        : FORM_VAZIO
    );
  }, [visible, servico]);

  const setField = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrors((prev) => ({ ...prev, [campo]: undefined }));
  };

  const handleSubmit = () => {
    const preco = Number(String(form.preco).replace(',', '.'));
    const duracaoMinutos = Number(form.duracaoMinutos);

    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = 'Informe o nome do serviço.';
    if (form.preco === '' || Number.isNaN(preco) || preco < 0) {
      novosErros.preco = 'Informe um preço válido.';
    }
    if (form.duracaoMinutos === '' || Number.isNaN(duracaoMinutos) || duracaoMinutos < 5) {
      novosErros.duracaoMinutos = 'Duração mínima de 5 minutos.';
    }

    if (Object.keys(novosErros).length) {
      setErrors(novosErros);
      return;
    }

    onSubmit({
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      preco,
      duracaoMinutos,
      ativo: form.ativo
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{editando ? 'Editar serviço' : 'Novo serviço'}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={[styles.input, errors.nome && styles.inputError]}
              value={form.nome}
              onChangeText={(v) => setField('nome', v)}
              placeholder="Ex.: Corte degradê"
              placeholderTextColor={colors.muted}
            />
            {!!errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={form.descricao}
              onChangeText={(v) => setField('descricao', v)}
              placeholder="Detalhes do serviço (opcional)"
              placeholderTextColor={colors.muted}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Preço (R$) *</Text>
                <TextInput
                  style={[styles.input, errors.preco && styles.inputError]}
                  value={form.preco}
                  onChangeText={(v) => setField('preco', v)}
                  placeholder="35.00"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                />
                {!!errors.preco && <Text style={styles.error}>{errors.preco}</Text>}
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Duração (min) *</Text>
                <TextInput
                  style={[styles.input, errors.duracaoMinutos && styles.inputError]}
                  value={form.duracaoMinutos}
                  onChangeText={(v) => setField('duracaoMinutos', v)}
                  placeholder="30"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                />
                {!!errors.duracaoMinutos && (
                  <Text style={styles.error}>{errors.duracaoMinutos}</Text>
                )}
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Serviço ativo</Text>
              <Switch
                value={form.ativo}
                onValueChange={(v) => setField('ativo', v)}
                trackColor={{ false: colors.surfaceAlt, true: colors.accent }}
                thumbColor={colors.text}
              />
            </View>

            <Pressable
              style={[styles.submit, saving && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={styles.submitText}>
                {saving ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar serviço'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.md,
    maxHeight: '90%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800'
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.sm,
    marginBottom: 6
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top'
  },
  inputError: {
    borderColor: colors.danger
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  rowItem: {
    flex: 1
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs
  },
  submit: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: spacing.md,
    marginBottom: spacing.sm
  },
  submitDisabled: {
    opacity: 0.6
  },
  submitText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800'
  }
});
